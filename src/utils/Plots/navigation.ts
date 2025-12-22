import {
  MolangVariableMap,
  Player,
  system,
  world,
  type Vector3,
} from "@minecraft/server";
import { PATH_NODES } from "./pathGraph";
import { getNearestNodeId, getPlotCenter } from "./pathUtils";
import { findPath } from "./pathfinding";
import { PLOTS } from "./plotInfo";

const PARTICLE_ID = "minecraft:rising_border_dust_particle";
const PATH_Y = 65; // fallback if node y missing
const PARTICLE_SPACING = 4;
const UPDATE_INTERVAL_TICKS = 2;

// New toggles
const INTERPOLATE_SEGMENTS = true; // set false to show only original nodes
const MAX_POINTS_AHEAD = 60; // limit particles ahead of player
const MAX_POINTS_BEHIND = 5; // keep a few behind
const MAX_SPAWN_DISTANCE_FROM_PLAYER = 48;

// Limit how far final straight segment can extend (prevents “infinite” line when goal node picked badly)
const MAX_FINAL_SEGMENT_LENGTH = 160; // blocks
const ALWAYS_INCLUDE_PLOT_CENTER = true; // ensure particles reach plot center

const NAV_TIMEOUT_TICKS = 20 * 60 * 5; // 5 minutes in ticks (20 ticks/sec)
const activeNav = new Map<string, NavState>();
const navStartTick = new Map<string, number>();

interface NavState {
  plotId: number;
  nodePath: string[];
  pathPoints: Vector3[];
  // cumulative distances along path (same length as pathPoints)
  cumulative: number[];
}

function buildPathPoints(nodePath: string[], finalTarget: Vector3): Vector3[] {
  const points: Vector3[] = [];
  if (nodePath.length === 0) {
    if (ALWAYS_INCLUDE_PLOT_CENTER) points.push(finalTarget);
    return points;
  }

  for (let i = 0; i < nodePath.length; i++) {
    const nodeId = nodePath[i];
    if (!nodeId) continue;
    const node = PATH_NODES[nodeId];
    if (!node) continue;
    const basePoint: Vector3 = {
      x: node.pos.x,
      y: node.pos.y ?? PATH_Y,
      z: node.pos.z,
    };
    points.push(basePoint);

    if (!INTERPOLATE_SEGMENTS || i === nodePath.length - 1) continue;

    const nextId = nodePath[i + 1];
    const nextNode = nextId && PATH_NODES[nextId];
    if (!nextNode) continue;

    const a = node.pos;
    const b = nextNode.pos;
    const dx = b.x - a.x;
    const dy = (b.y ?? PATH_Y) - (a.y ?? PATH_Y);
    const dz = b.z - a.z;
    const segLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (segLength === 0) continue;
    const steps = Math.max(1, Math.floor(segLength / PARTICLE_SPACING));
    for (let s = 1; s < steps; s++) {
      points.push({
        x: a.x + (dx / steps) * s,
        y: (a.y ?? PATH_Y) + (dy / steps) * s,
        z: a.z + (dz / steps) * s,
      });
    }
  }

  // Only add a final straight segment if the plot center is NOT already very close to the last node
  const lastNodeId = nodePath[nodePath.length - 1];
  const lastNode = lastNodeId && PATH_NODES[lastNodeId];
  if (lastNode) {
    const a = lastNode.pos;
    const fullDx = finalTarget.x - a.x;
    const fullDy = finalTarget.y - (a.y ?? PATH_Y);
    const fullDz = finalTarget.z - a.z;
    const fullLength = Math.sqrt(
      fullDx * fullDx + fullDy * fullDy + fullDz * fullDz
    );

    // Only allow a final straight segment if there is no path node closer to the plot than the last node
    let allowFinalSegment = true;
    for (const id in PATH_NODES) {
      if (id === lastNodeId) continue;
      const node = PATH_NODES[id];
      if (!node) continue;
      const nodeDist = Math.sqrt(
        (node.pos.x - finalTarget.x) ** 2 +
          ((node.pos.y ?? PATH_Y) - finalTarget.y) ** 2 +
          (node.pos.z - finalTarget.z) ** 2
      );
      if (nodeDist + 0.01 < fullLength) {
        allowFinalSegment = false;
        break;
      }
    }

    if (allowFinalSegment && fullLength > 0) {
      const segments = Math.ceil(fullLength / MAX_FINAL_SEGMENT_LENGTH);
      const chunkDx = fullDx / segments;
      const chunkDy = fullDy / segments;
      const chunkDz = fullDz / segments;

      for (let seg = 0; seg < segments; seg++) {
        const segStartX = a.x + chunkDx * seg;
        const segStartY = (a.y ?? PATH_Y) + chunkDy * seg;
        const segStartZ = a.z + chunkDz * seg;
        const segEndX = a.x + chunkDx * (seg + 1);
        const segEndY = (a.y ?? PATH_Y) + chunkDy * (seg + 1);
        const segEndZ = a.z + chunkDz * (seg + 1);
        const dx = segEndX - segStartX;
        const dy = segEndY - segStartY;
        const dz = segEndZ - segStartZ;
        const segLen = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const steps = Math.max(1, Math.floor(segLen / PARTICLE_SPACING));
        for (let s = 1; s <= steps; s++) {
          points.push({
            x: segStartX + (dx / steps) * s,
            y: segStartY + (dy / steps) * s,
            z: segStartZ + (dz / steps) * s,
          });
        }
      }
    }
  }

  if (ALWAYS_INCLUDE_PLOT_CENTER) {
    const last = points[points.length - 1];
    if (
      !last ||
      last.x !== finalTarget.x ||
      last.z !== finalTarget.z ||
      last.y !== finalTarget.y
    ) {
      points.push(finalTarget);
    }
  }

  return points;
}

function buildCumulative(points: Vector3[]): number[] {
  const out: number[] = [];
  let acc = 0;
  out.push(acc);
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currPoint = points[i];
    if (!prevPoint || !currPoint) continue;
    const dx = currPoint.x - prevPoint.x;
    const dy = currPoint.y - prevPoint.y;
    const dz = currPoint.z - prevPoint.z;
    acc += Math.sqrt(dx * dx + dy * dy + dz * dz);
    out.push(acc);
  }
  return out;
}

// Utility distance
function dist(
  a: { x: number; z: number },
  b: { x: number; z: number }
): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

// Improved compressNodePath: removes unnecessary detours at intersections, always prefers direct intersection-to-intersection or intersection-to-goal hops if possible.
function compressNodePath(nodePath: string[]): string[] {
  if (nodePath.length < 3) return nodePath.slice();
  const out = nodePath.slice();
  let changed = true;

  // Helper to get 2D distance between nodes
  function dist2D(aId: string, bId: string): number {
    const a = PATH_NODES[aId];
    const b = PATH_NODES[bId];
    if (!a || !b) return Number.POSITIVE_INFINITY;
    const dx = a.pos.x - b.pos.x;
    const dz = a.pos.z - b.pos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  while (changed) {
    changed = false;

    for (let i = 0; i < out.length - 2; i++) {
      const aId = out[i];
      const bId = out[i + 1];
      const cId = out[i + 2];
      if (!aId || !bId || !cId) continue;
      const a = PATH_NODES[aId];
      const b = PATH_NODES[bId];
      const c = PATH_NODES[cId];
      if (!a || !b || !c) continue;

      // Prefer skipping to an intersection if it's directly reachable and closer or equally close
      if (a.isIntersection && a.neighbors.includes(c.id) && !b.isIntersection) {
        const distAC = dist2D(aId, cId);
        const distAB = dist2D(aId, bId);
        if (c.isIntersection || distAC <= distAB) {
          out.splice(i + 1, 1);
          changed = true;
          break;
        }
      }

      // If b is intersection and a can go directly to c, prefer skipping b if c is intersection or closer
      if (b.isIntersection && a.neighbors.includes(c.id)) {
        const distAC = dist2D(aId, cId);
        const distAB = dist2D(aId, bId);
        if (c.isIntersection || distAC <= distAB) {
          out.splice(i + 1, 1);
          changed = true;
          break;
        }
      }
    }
  }

  return out;
}

export function startNavigationToPlot(player: Player, plotId: number) {
  const plotCenter = getPlotCenter(plotId);

  const plot = PLOTS[plotId];
  if (!plot) {
    player.sendMessage(`§cPlot ${plotId} is not configured.`);
    return;
  }
  const playerPos = player.location;

  const startNodeId = getNearestNodeId({ x: playerPos.x, z: playerPos.z });
  if (!startNodeId) {
    player.sendMessage("§cCould not find nearest path node.");
    return;
  }

  const goalNodeId = getNearestNodeId({ x: plotCenter.x, z: plotCenter.z });
  if (!goalNodeId) {
    player.sendMessage("§cCould not find path near the plot.");
    return;
  }

  const rawNodePath = findPath(startNodeId, goalNodeId);
  if (!rawNodePath) {
    player.sendMessage("§cNo navigation path available.");
    return;
  }

  // Compress to avoid overlapping particle triangles at intersections
  const nodePath = compressNodePath(rawNodePath);

  const pathPoints = buildPathPoints(nodePath, plotCenter);
  const cumulative = buildCumulative(pathPoints);

  activeNav.set(player.id, {
    plotId,
    nodePath,
    pathPoints,
    cumulative,
  });
  navStartTick.set(player.id, system.currentTick); // Track when navigation started
  player.sendMessage(`§aShowing path to plot §e${plotId}§a.`);
}

// Add helper exports
export function isNavigating(playerId: string): boolean {
  return activeNav.has(playerId);
}

export function cancelNavigation(playerId: string): void {
  navStartTick.delete(playerId);
  if (activeNav.delete(playerId)) {
    const pl = world.getPlayers().find((p) => p.id === playerId);
    if (pl) pl.sendMessage("§cNavigation cancelled.");
  }
}

// End navigation after 5 minutes or on player leave
system.runInterval(() => {
  const now = system.currentTick;
  for (const [playerId, startTick] of navStartTick.entries()) {
    if (now - startTick > NAV_TIMEOUT_TICKS) {
      navStartTick.delete(playerId);
      activeNav.delete(playerId);
      const pl = world.getPlayers().find((p) => p.id === playerId);
      if (pl) pl.sendMessage("§cNavigation timed out after 5 minutes.");
    }
  }
}, 40); // check every 2 seconds

// End navigation when player leaves
world.afterEvents.playerLeave.subscribe((ev) => {
  cancelNavigation(ev.playerId);
});

system.runInterval(() => {
  for (const pl of world.getAllPlayers()) {
    const nav = activeNav.get(pl.id);
    if (!nav) continue;

    const { pathPoints, plotId } = nav;
    const plot = PLOTS[plotId];
    if (!plot) {
      activeNav.delete(pl.id);
      continue;
    }

    const playerPos: Vector3 = {
      x: pl.location.x,
      y: pl.location.y,
      z: pl.location.z,
    };

    const center = getPlotCenter(plotId);
    const cdx = playerPos.x - center.x;
    const cdy = playerPos.y - center.y;
    const cdz = playerPos.z - center.z;
    if (cdx * cdx + cdy * cdy + cdz * cdz <= 24 * 24) {
      activeNav.delete(pl.id);
      pl.sendMessage(
        `§aArrived near plot §e${plotId}§a (within 24 blocks). Navigation ended.`
      );
      continue;
    }

    let nearestIndex = 0;
    let bestDistSq = Number.POSITIVE_INFINITY;
    for (let i = 0; i < pathPoints.length; i++) {
      const p = pathPoints[i];
      if (!p) continue;
      const dx = p.x - playerPos.x;
      const dy = p.y - playerPos.y;
      const dz = p.z - playerPos.z;
      const dSq = dx * dx + dy * dy + dz * dz;
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        nearestIndex = i;
      }
    }

    const molang = new MolangVariableMap();
    const start = Math.max(0, nearestIndex - MAX_POINTS_BEHIND);
    const end = Math.min(
      pathPoints.length - 1,
      nearestIndex + MAX_POINTS_AHEAD
    );

    for (let i = start; i <= end; i++) {
      const p = pathPoints[i];
      if (!p) continue;
      const dx = p.x - playerPos.x;
      const dy = p.y - playerPos.y;
      const dz = p.z - playerPos.z;
      const dSq = dx * dx + dy * dy + dz * dz;
      if (dSq > MAX_SPAWN_DISTANCE_FROM_PLAYER * MAX_SPAWN_DISTANCE_FROM_PLAYER)
        continue;
      pl.spawnParticle(PARTICLE_ID, p, molang);
    }
  }
}, UPDATE_INTERVAL_TICKS);
