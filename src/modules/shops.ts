import {
  Entity,
  Player,
  PlayerInteractWithEntityBeforeEvent,
  system,
  type EntityHitEntityAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import type { Shop, ShopOption } from "../types/shops";
import API from "../utils/API/API";
import Form from "../utils/form/form";
import Formatter from "../utils/formatter";
import Item from "../utils/item";
import Member from "../utils/wrappers/member";
import World from "../utils/wrappers/world";

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

  public static async Sell(member: Member): Promise<void> {
    const cooldown = this.SellCooldown[member.EntityID()];

    if (cooldown && Date.now() - cooldown < 1000) {
      member.SendError(`Please wait a moment before selling again!`);
      return;
    }

    this.SellCooldown[member.EntityID()] = Date.now();

    const { data: profile } = await API.Profiles.Profile(member.EntityID());

    if (!profile) {
      member.SendError("Could not find your profile!");
      return;
    }

    const items = member.InventoryItems();
    let totalItems = 0;
    let total = 0;

    for (const item of items) {
      const option = Config.shop_selling_options[item.data.typeId];

      if (!option) {
        continue;
      }

      member.SetInventorySlot(item.slot);

      totalItems += item.data.amount;
      total += option * item.data.amount;
    }

    if (total === 0) {
      member.SendError("You have no items to sell!");
      return;
    }

    await API.Profiles.Update(member.EntityID(), {
      balance: profile.balance + total,
    });

    member.SendSuccess(
      `You sold ${totalItems} items for $${Formatter.ToComma(total)}!`
    );
  }

  private static async DisplayShop(member: Member, shop: Shop): Promise<void> {
    if (shop.options.length === 0) {
      member.SendError("Shop is empty!");
      return;
    }

    const form = await Form.ChestForm({
      ...Form.BaseChestOptions(member),
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
      member.SendError("Form closed.");
      return;
    }

    const option = shop.options.find(
      (option) => option.slot === form.selection
    );

    if (!option) {
      this.DisplayShop(member, shop);
      return;
    }

    await this.DisplayOption(member, shop, option);
  }
  private static async DisplayOption(
    member: Member,
    shop: Shop,
    option: ShopOption
  ): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§c" + shop.name,
      body: `§7Hello, ${member.Username()}!\n\nWould you like to purchase §r§l§c${
        option.name
      }§r§7?\n\n`,
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
        member.SendError("Form closed.");
        break;
      case 0:
        const items = option.items.map((item) => Item.Create(item));

        if (items.length > member.EmptyInventorySlots()) {
          member.SendError(
            "You don't have enough inventory space for this purchase!"
          );
          break;
        }
        if (items.length === 0) {
          member.SendError("Shop chest has nothing in it!");
          break;
        }

        const request = await API.Shops.Purchase({
          entity_id: member.EntityID(),
          option: option.name,
          price: option.price,
          shop: shop.name,
        });

        switch (request.status) {
          case 200:
            for (const item of items) {
              member.AddInventoryItem(item);
            }

            member.SendSuccess(
              `You have successfully purchased §l${option.name}§r§a!`
            );
            break;
          case 402:
            member.SendError(
              "You don't have enough balance for this purchase!"
            );
            break;

          default:
            member.SendError("Something went wrong during your purchase!");
            break;
        }

        break;
      case 1:
        member.SendError(
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
    const member = new Member(player);

    if (entity.hasTag(Config.shop_selling_tag)) {
      this.Sell(member);
      return;
    }

    const shop = this.GetShop(entity);

    if (!shop) {
      return;
    }

    this.DisplayShop(member, shop);
  }

  private static UpdateShopNames(): void {
    const villagers = World.Entities().filter((entity) =>
      entity.typeId.includes("villager")
    );
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
