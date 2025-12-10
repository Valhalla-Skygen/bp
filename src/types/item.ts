import type { ItemLockMode } from "@minecraft/server";

export interface ItemData {
  typeId: string;
  nameTag?: string;
  amount?: number;
  damage?: number;
  keepOnDeath?: boolean;
  lockMode?: ItemLockMode;
  enchants?: ItemEnchant[];
  properties?: Record<string, any>;
}
export interface ItemEnchant {
  id: string;
  level: number;
}
