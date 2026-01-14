import type { Vector3 } from "@minecraft/server";
import type { ItemData } from "./item";

export interface Crate {
  name: string;
  currency_key: string; // Pretty much the key of the key, so crate_common, or crate_common
  location: Vector3;
  rewards: CrateReward[];
}
export interface CrateReward {
  name: string;
  description: string[];
  weight: number;
  display_item: ItemData;
  items?: ItemData[];
  currencies?: Record<string, number>;
}
