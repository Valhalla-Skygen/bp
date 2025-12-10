import type { ItemData } from "./item";

export interface Shop {
  name: string;
  tag: string;
  options: ShopOption[];
}
export interface ShopOption {
  name: string;
  icon: string;
  price: number;
  slot: number;
  items: ItemData[];
  description?: string[];
  amount?: number;
  enchanted?: boolean;
}
export interface ShopPurchase {
  entity_id: string;
  shop: string;
  option: string;
  price: number;
  created_at: Date;
}
