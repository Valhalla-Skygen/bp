import type { ShopPurchase } from "../../../types/shops";
import API from "../API";

const ShopRoute = {
  Purchase: (data: Partial<ShopPurchase>) =>
    API.Post<ShopPurchase, never>("/shop/purchase/", data),
};

export default ShopRoute;
