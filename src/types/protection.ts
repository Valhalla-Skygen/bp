import type { Vector3 } from "@minecraft/server";

export interface Zone {
  radius: number;
  tag: string;
  safe: boolean;
  location: Vector3;
}
