import type { Vector3 } from "@minecraft/server";

export interface Warp {
  name: string;
  icon: string;
  tag: string;
  location: Vector3;
}
