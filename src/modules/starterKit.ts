import {
  EquipmentSlot,
  Player,
  world,
  type EntityHitEntityAfterEvent,
  type PlayerInteractWithEntityAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import Form from "../utils/form/form";
import Item from "../utils/item";
import Sleep from "../utils/sleep";

export default class StarterKit {
  public static async Init(): Promise<void> {
    await Sleep(0);

    const entities = world
      .overworld()
      .getEntities({ tags: [Config.starter_kit_tag] });

    for (const entity of entities) {
      entity.nameTag =
        "§cStarter Kit\n\n§7Attack To Claim\n§7Sneak & Attack to Open Menu";
    }
  }

  public static OnHit(event: EntityHitEntityAfterEvent): void {
    const { damagingEntity: player, hitEntity: target } = event;

    if (!(player instanceof Player)) {
      return;
    }
    if (!target.hasTag(Config.starter_kit_tag)) {
      return;
    }
    if (player.isSneaking) {
      this.Menu(player);
      return;
    }

    this.Give(player);
  }
  public static OnInteraction(event: PlayerInteractWithEntityAfterEvent): void {
    const { player, target } = event;

    if (!target.hasTag(Config.starter_kit_tag)) {
      return;
    }
    if (player.isSneaking) {
      this.Menu(player);
      return;
    }

    this.Give(player);
  }

  public static Give(player: Player, silent = false): void {
    if (
      player
        .equipmentItems()
        .filter((item) => item.slot !== EquipmentSlot.Mainhand).length > 0
    ) {
      if (!silent) {
        player.sendError("You already have armor on!");
      }

      return;
    }

    const food = Item.Create(Config.starter_kit.food);
    const helmet = Item.Create(Config.starter_kit.helmet);
    const chestplate = Item.Create(Config.starter_kit.chestplate);
    const leggings = Item.Create(Config.starter_kit.leggings);
    const boots = Item.Create(Config.starter_kit.boots);
    const sword = Item.Create(Config.starter_kit.sword);
    const axe = Item.Create(Config.starter_kit.axe);
    const pickaxe = Item.Create(Config.starter_kit.pickaxe);
    const shovel = Item.Create(Config.starter_kit.shovel);
    const hoe = Item.Create(Config.starter_kit.hoe);

    player.setEquipmentItem("Head", helmet);
    player.setEquipmentItem("Chest", chestplate);
    player.setEquipmentItem("Legs", leggings);
    player.setEquipmentItem("Feet", boots);
    player.addInventoryItem(sword);
    player.addInventoryItem(axe);
    player.addInventoryItem(pickaxe);
    player.addInventoryItem(shovel);
    player.addInventoryItem(hoe);
    player.addInventoryItem(food);

    if (!silent) {
      player.sendSuccess("You have received your starter kit!");
    }
  }

  private static async Menu(player: Player): Promise<void> {
    const form = await Form.ChestForm({
      player,
      title: "§cStarter Kit",
      size: "double",
      pattern: {
        lines: [
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
        ],
        keys: [
          {
            character: "x",
            itemName: "",
            texture: "textures/blocks/glass_black",
          },
        ],
      },
      buttons: [
        {
          slot: 4,
          itemName: "§cStarter Food",
          texture: "minecraft:cooked_beef",
          enchanted: true,
        },
        {
          slot: 11,
          itemName: "§cStarter Sword",
          texture: "minecraft:wooden_sword",
          enchanted: true,
        },
        {
          slot: 13,
          itemName: "§cStarter Helmet",
          texture: "minecraft:leather_helmet",
          enchanted: true,
        },
        {
          slot: 15,
          itemName: "§cStarter Axe",
          texture: "minecraft:wooden_axe",
          enchanted: true,
        },
        {
          slot: 22,
          itemName: "§cStarter Chestplate",
          texture: "minecraft:leather_chestplate",
          enchanted: true,
        },
        {
          slot: 29,
          itemName: "§cStarter Pickaxe",
          texture: "minecraft:wooden_pickaxe",
          enchanted: true,
        },
        {
          slot: 31,
          itemName: "§cStarter Leggings",
          texture: "minecraft:leather_leggings",
          enchanted: true,
        },
        {
          slot: 33,
          itemName: "§cStarter Shovel",
          texture: "minecraft:wooden_shovel",
          enchanted: true,
        },
        {
          slot: 40,
          itemName: "§cStarter Boots",
          texture: "minecraft:leather_boots",
          enchanted: true,
        },
        {
          slot: 49,
          itemName: "§cStarter Hoe",
          texture: "minecraft:wooden_hoe",
          enchanted: true,
        },
      ],
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    switch (form.selection) {
      case 4:
        player.addInventoryItem(Item.Create(Config.starter_kit.food));
        this.Menu(player);
        break;
      case 11:
        player.addInventoryItem(Item.Create(Config.starter_kit.sword));
        this.Menu(player);
        break;
      case 13:
        player.addInventoryItem(Item.Create(Config.starter_kit.helmet));
        this.Menu(player);
        break;
      case 15:
        player.addInventoryItem(Item.Create(Config.starter_kit.axe));
        this.Menu(player);
        break;
      case 22:
        player.addInventoryItem(Item.Create(Config.starter_kit.chestplate));
        this.Menu(player);
        break;
      case 29:
        player.addInventoryItem(Item.Create(Config.starter_kit.pickaxe));
        this.Menu(player);
        break;
      case 31:
        player.addInventoryItem(Item.Create(Config.starter_kit.leggings));
        this.Menu(player);
        break;
      case 33:
        player.addInventoryItem(Item.Create(Config.starter_kit.shovel));
        this.Menu(player);
        break;
      case 40:
        player.addInventoryItem(Item.Create(Config.starter_kit.boots));
        this.Menu(player);
        break;
      case 49:
        player.addInventoryItem(Item.Create(Config.starter_kit.hoe));
        this.Menu(player);
        break;
      default:
        this.Menu(player);
        break;
    }
  }
}
