import { PATH_NODES } from "./pathGraph";
import { distanceSq2D } from "./pathUtils";

function heuristic(aId: string, bId: string): number {
  const a = PATH_NODES[aId];
  const b = PATH_NODES[bId];
  if (!a || !b) return Number.POSITIVE_INFINITY;
  return Math.sqrt(distanceSq2D(a.pos, b.pos));
}

export function findPath(startId: string, goalId: string): string[] | null {
  if (startId === goalId) return [startId];

  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};

  for (const id in PATH_NODES) {
    gScore[id] = Number.POSITIVE_INFINITY;
    fScore[id] = Number.POSITIVE_INFINITY;
  }
  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, goalId);

  while (openSet.size > 0) {
    // node in openSet with lowest fScore
    let current: string | null = null;
    let best = Number.POSITIVE_INFINITY;
    for (const id of openSet) {
      const f = fScore[id];
      if (f !== undefined && f < best) {
        best = f;
        current = id;
      }
    }

    if (!current) break;
    if (current === goalId) {
      const path: string[] = [];
      let cur: string | undefined = current;
      while (cur) {
        path.push(cur);
        cur = cameFrom.get(cur);
      }
      path.reverse();
      return path;
    }

    openSet.delete(current);
    const node = PATH_NODES[current];
    if (!node) continue;

    for (const neighbor of node.neighbors) {
      if (!PATH_NODES[neighbor]) continue;
      const tentative = (gScore[current] ?? Number.POSITIVE_INFINITY) + Math.sqrt(distanceSq2D(node.pos, PATH_NODES[neighbor].pos));
      if (tentative < (gScore[neighbor] ?? Number.POSITIVE_INFINITY)) {
        cameFrom.set(neighbor, current);
        gScore[neighbor] = tentative;
        fScore[neighbor] = tentative + heuristic(neighbor, goalId);
        openSet.add(neighbor);
      }
    }
  }

  return null;
}
