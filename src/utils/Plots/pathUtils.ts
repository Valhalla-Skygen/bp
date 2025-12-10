import { PATH_NODES } from "./pathGraph"; // moved up so stick block can use it

const EXISTING_NODE_PARTICLE_ID = "minecraft:rising_border_dust_particle";
const NEW_NODE_PARTICLE_ID = "minecraft:basic_flame_particle"; // different color/style
const NODE_VIS_RADIUS = 50;              // reduced from 96; only attempt particles within 50 blocks
const NODE_PARTICLE_INTERVAL_TICKS = 5;  // render every 5 ticks

// Add cooldown map at top of file
const STICK_COOLDOWN_TICKS = 20; // 1 second (20 ticks)
const stickLastUse: Record<string, number> = {};

// Generate next label sequence:
// A ... Z, ZA ... ZZ, ZZA ... ZZZ, ZZZ A ... etc.
// (Prefix of one or more 'Z' followed by A..Z; when suffix hits Z, extend with another 'Z' + 'A')
// function nextPathLabel(prev?: string): string {
//   if (!prev) return "A";
//   if (prev.length === 1 && prev !== "Z") {
//     return String.fromCharCode(prev.charCodeAt(0) + 1);
//   }
//   if (prev === "Z") return "ZA";
//   const m = prev.match(/^(Z+)([A-Z])$/);
//   if (m) {
//     const prefix = m[1];
//     const tail = m[2];
//     if (tail && tail !== "Z") {
//       return prefix + String.fromCharCode(tail.charCodeAt(0) + 1);
//     } else {
//       return prefix + "Z" + "A";
//     }
//   }
//   return "A";
// }

// Stick interaction for logging nodes
// world.beforeEvents.playerInteractWithBlock.subscribe(async (ev: PlayerInteractWithBlockBeforeEvent) => {
//   const { player, block } = ev;
//   if (!player || !block) return;

//   const inv = player.getComponent("inventory")?.container;
//   if (!inv) return;
//   const held = inv.getItem(player.selectedSlotIndex);
//   if (!held || held.typeId !== "minecraft:stick") return;

//   // Cooldown: only allow once per second per player
//   const now = system.currentTick;
//   const lastUse = stickLastUse[player.id];
//   if (lastUse && now - lastUse < STICK_COOLDOWN_TICKS) return;
//   stickLastUse[player.id] = now;

//   // Find nearest node within 5 blocks
//   const px = block.location.x;
//   const py = block.location.y + 2;
//   const pz = block.location.z;
//   let nearestId: string | null = null;
//   let nearestDist = Number.POSITIVE_INFINITY;
//   for (const id in PATH_NODES) {
//     const node = PATH_NODES[id];
//     if (!node) continue;
//     const dx = node.pos.x - px;
//     const dy = (node.pos.y ?? 0) - py;
//     const dz = node.pos.z - pz;
//     const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
//     if (dist < nearestDist) {
//       nearestDist = dist;
//       nearestId = id;
//     }
//   }

//   if (nearestId && nearestDist <= 5) {
//     const node = PATH_NODES[nearestId];
//     if (node) {
//       // Show neighbor distances
//       const neighborLines = node.neighbors.map(nid => {
//         const n = PATH_NODES[nid];
//         if (!n) return `${nid} (unknown)`;
//         const dx = n.pos.x - node.pos.x;
//         const dy = (n.pos.y ?? 0) - (node.pos.y ?? 0);
//         const dz = n.pos.z - node.pos.z;
//         const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
//         return `§b${nid}§7 (${dist.toFixed(2)} blocks)`;
//       }).join("\n");

//       player.sendMessage(
//         `§eNearest node: §a${node.id} §7at §f${node.pos.x} ${node.pos.y} ${node.pos.z}\n` +
//         `§7Intersection: §b${!!node.isIntersection}\n` +
//         `§7Neighbors:\n${neighborLines}`
//       );
//       return;
//     }
//   }
// });

// Particle visualizer while holding stick
// system.runInterval(() => {
//   for (const pl of world.getAllPlayers()) {
//     const inv = pl.getComponent("inventory")?.container;
//     if (!inv) continue;
//     const held = inv.getItem(pl.selectedSlotIndex);
//     if (!held || held.typeId !== "minecraft:stick") continue;

//     const px = pl.location.x;
//     const py = pl.location.y;
//     const pz = pl.location.z;
//     const radiusSq = NODE_VIS_RADIUS * NODE_VIS_RADIUS;
//     const molang = new MolangVariableMap();

//     // Existing graph nodes (only if within 50 blocks)
//     for (const id in PATH_NODES) {
//       const node = PATH_NODES[id];
//       if (!node) continue;
//       const dx = node.pos.x - px;
//       const dy = node.pos.y - py;
//       const dz = node.pos.z - pz;
//       if (dx * dx + dy * dy + dz * dz > radiusSq) continue;
//       pl.spawnParticle(EXISTING_NODE_PARTICLE_ID, { x: node.pos.x, y: node.pos.y, z: node.pos.z }, molang);
//     }
//   }
// }, NODE_PARTICLE_INTERVAL_TICKS);
// === End Temporary Tool ===

import type { Vector3 } from "@minecraft/server";
import { PLOTS, type PlotDef } from "./plotInfo";

const sqr = (n: number) => n * n;

export function distanceSq2D(
  a: { x: number; z: number },
  b: { x: number; z: number }
): number {
  return sqr(a.x - b.x) + sqr(a.z - b.z);
}

export function getNearestNodeId(pos: { x: number; z: number }): string | null {
  let bestId: string | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const id in PATH_NODES) {
    const node = PATH_NODES[id];
    if (!node) continue;
    const d = distanceSq2D(pos, node.pos);
    if (d < bestDist) {
      bestDist = d;
      bestId = id;
    }
  }

  return bestId;
}

export function getPlotCenter(plotId: number): Vector3 {
  const plot = PLOTS[plotId];
  if (!plot) throw new Error(`Plot ${plotId} not defined`);

  const centerX = plot.minX + plot.width / 2;
  const centerZ = plot.minZ + plot.length / 2;

  // Use plot.y instead of fixed PATH_Y
  return { x: centerX, y: plot.y, z: centerZ };
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

export function distanceToPlotRegion(pos: Vector3, plot: PlotDef): number {
  const minX = plot.minX;
  const maxX = plot.minX + plot.width;
  const minZ = plot.minZ;
  const maxZ = plot.minZ + plot.length;

  const closestX = clamp(pos.x, minX, maxX);
  const closestZ = clamp(pos.z, minZ, maxZ);

  const dx = pos.x - closestX;
  const dz = pos.z - closestZ;

  // 2D region distance kept (Y not needed for region boundary)
  return Math.sqrt(dx * dx + dz * dz);
}