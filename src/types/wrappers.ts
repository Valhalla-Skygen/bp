import type { EquipmentSlot, ItemStack } from "@minecraft/server";

export type InventoryItem = {
  data: ItemStack;
  slot: number;
};
export type EquipmentItem = {
  data: ItemStack;
  slot: keyof typeof EquipmentSlot;
};
export type MixedItem = {
  data: ItemStack;
  slot: number | keyof typeof EquipmentSlot;
};

export interface Health {
  current: number;
  max: number;
}
