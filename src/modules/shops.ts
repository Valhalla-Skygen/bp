import {
  Entity,
  Player,
  PlayerInteractWithEntityBeforeEvent,
  system,
  world,
  type EntityHitEntityAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import type { Shop, ShopOption } from "../types/shops";
import API from "../utils/API/API";
import Form from "../utils/form/form";
import Formatter from "../utils/formatter";
import Item from "../utils/item";

export default class Shops {
  private static SellCooldown: Record<string, number> = {};

  public static async Init(): Promise<void> {
    system.run(() => this.UpdateShopNames());
  }

  public static async OnInteraction(
    event: PlayerInteractWithEntityBeforeEvent
  ): Promise<void> {
    const { player, target } = event;

    system.run(() => this.Handle(player, target));
  }
  public static OnHit(event: EntityHitEntityAfterEvent): void {
    const { damagingEntity: player, hitEntity: target } = event;

    if (!(player instanceof Player)) {
      return;
    }

    system.run(() => this.Handle(player, target));
  }

  public static async Sell(player: Player): Promise<void> {
    const cooldown = this.SellCooldown[player.id];

    if (cooldown && Date.now() - cooldown < 1000) {
      player.sendError(`Please wait a moment before selling again!`);
      return;
    }

    this.SellCooldown[player.id] = Date.now();

    const { data: profile } = await API.Profiles.Profile(player.id);

    if (!profile) {
      player.sendError("Could not find your profile!");
      return;
    }

    const items = player.inventoryItems();
    let totalItems = 0;
    let total = 0;

    for (const item of items) {
      const option = Config.shop_selling_options[item.data.typeId];

      if (!option) {
        continue;
      }

      player.setInventoryItem(item.slot);

      totalItems += item.data.amount;
      total += option * item.data.amount;
    }

    if (total === 0) {
      player.sendError("You have no items to sell!");
      return;
    }

    await API.Profiles.Update(player.id, {
      balance: profile.balance + total,
    });

    player.sendSuccess(
      `You sold ${totalItems} items for $${Formatter.ToComma(total)}!`
    );
  }

  private static async DisplayShop(player: Player, shop: Shop): Promise<void> {
    if (shop.options.length === 0) {
      player.sendError("Shop is empty!");
      return;
    }

    const form = await Form.ChestForm({
      ...Form.BaseChestOptions(player),
      title: "§c" + shop.name,
      buttons: shop.options.map((option) => {
        return {
          durability: 0,
          enchanted: option.enchanted,
          itemDescription: [
            `§7Price - §a$${Formatter.ToShort(option.price)}§r`,
            ...(option.description || []),
          ],
          itemName: "§l§c" + option.name + "\n",
          stackSize: 1,
          texture: option.icon,
          slot: option.slot,
        };
      }),
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    const option = shop.options.find(
      (option) => option.slot === form.selection
    );

    if (!option) {
      this.DisplayShop(player, shop);
      return;
    }

    await this.DisplayOption(player, shop, option);
  }
  private static async DisplayOption(
    player: Player,
    shop: Shop,
    option: ShopOption
  ): Promise<void> {
    const form = await Form.ActionForm({
      player: player,
      title: "§c" + shop.name,
      body: `§7Hello, ${player.name}!\n\nWould you like to purchase §r§l§c${option.name}§r§7?\n\n`,
      buttons: [
        {
          text: "Confirm",
          subtext: "Click to Purchase",
          icon: "textures/blocks/glass_green",
        },
        {
          text: "Cancel",
          subtext: "Click to Cancel",
          icon: "textures/blocks/glass_red",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        player.sendError("Form closed.");
        break;
      case 0:
        const items = option.items.map((item) => Item.Create(item));

        if (items.length > player.emptyInventorySlots()) {
          player.sendError(
            "You don't have enough inventory space for this purchase!"
          );
          break;
        }
        if (items.length === 0) {
          player.sendError("Shop chest has nothing in it!");
          break;
        }

        const request = await API.Shops.Purchase({
          entity_id: player.id,
          option: option.name,
          price: option.price,
          shop: shop.name,
        });

        switch (request.status) {
          case 200:
            for (const item of items) {
              player.addInventoryItem(item);
            }

            player.sendSuccess(
              `You have successfully purchased §l${option.name}§r§a!`
            );
            break;
          case 402:
            player.sendError(
              "You don't have enough balance for this purchase!"
            );
            break;

          default:
            player.sendError("Something went wrong during your purchase!");
            break;
        }

        break;
      case 1:
        player.sendError(
          `You have cancelled the purchase of §l${option.name}§r!`
        );
        break;
    }
  }

  private static GetShop(entity: Entity): Shop | undefined {
    const shop = Config.shops.find((shop) =>
      entity.getTags().some((tag) => tag === shop.tag)
    );

    return shop;
  }

  private static Handle(player: Player, entity: Entity): void {
    if (entity.hasTag(Config.shop_selling_tag)) {
      this.Sell(player);
      return;
    }

    const shop = this.GetShop(entity);

    if (!shop) {
      return;
    }

    this.DisplayShop(player, shop);
  }

  private static UpdateShopNames(): void {
    const villagers = world
      .overworld()
      .getEntities()
      .filter((entity) => entity.typeId.includes("villager"));
    const sellingVillagers = villagers.filter((entity) =>
      entity.hasTag(Config.shop_selling_tag)
    );

    for (const villager of sellingVillagers) {
      villager.nameTag = "§cSell Items\n§7[ Click/Interact To Sell ]";
    }
    for (const shop of Config.shops) {
      const filtered = villagers.filter((entity) => entity.hasTag(shop.tag));

      for (const villager of filtered) {
        villager.nameTag = "§c" + shop.name + "\n§7[ Click/Interact To Open ]";
      }
    }
  }
}
