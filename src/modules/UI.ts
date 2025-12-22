import {
  EquipmentSlot,
  ItemLockMode,
  ItemStack,
  Player,
  system,
  world,
  type ItemUseAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import Form from "../utils/form/form";
import Linking from "./linking";
import Moderation from "./moderation";
import Plots from "./plots";
import Reports from "./reports";
import Rules from "./rules";
import Stats from "./stats";
import Transfer from "./transfer";
import Warps from "./warps";

export default class UI {
  public static async Init(): Promise<void> {
    this.ForceUI();
  }

  public static OnUse(event: ItemUseAfterEvent): void {
    const { itemStack: item, source: player } = event;

    if (item.typeId !== Config.ui_typeid) {
      return;
    }

    UI.MainPage(player);
  }

  public static async MainPage(player: Player): Promise<void> {
    const form = await Form.ActionForm({
      player: player,
      title: "§cValhalla UI",
      body: `§7Welcome, §l§c${player.name}§r§7!\n\nWhat would you like to do?\n\n`,
      buttons: [
        {
          text: "Warps",
          subtext: "Click to Open",
          icon: "textures/items/ender_pearl",
        },
        {
          text: "Plots",
          subtext: "Click to Open",
          icon: "textures/items/minecart_chest",
        },
        {
          text: "Player Information",
          subtext: "Click to Open",
          icon: "textures/ui/dressing_room_skins",
        },
        {
          text: "Server Information",
          subtext: "Click to Open",
          icon: "textures/items/book_enchanted",
        },
        {
          text: "Settings",
          subtext: "Click to Open",
          icon: "textures/ui/settings_glyph_color_2x",
        },
        {
          text: "Admin Management",
          subtext: "Click to Open",
          icon: "textures/ui/op",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        player.sendError("Form closed.");
        break;
      case 0:
        Warps.View(player);
        break;
      case 1:
        Plots.Redirector(player);
        break;
      case 2:
        this.PlayerInformationPage(player);
        break;
      case 3:
        this.ServerInformationPage(player);
        break;
      case 4:
        break;
      case 5:
        Moderation.View(player);
        break;
    }
  }
  public static async PlayerInformationPage(player: Player): Promise<void> {
    const form = await Form.ActionForm({
      player: player,
      title: "§cPlayer Information",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nWhat would you like to do?\n\n`,
      buttons: [
        {
          text: "Report a Member",
          subtext: "Click to Open",
          icon: "textures/ui/hammer_l",
        },
        {
          text: "Money Transfer",
          subtext: "Click to Open",
          icon: "textures/items/emerald",
        },
        {
          text: "Statistics",
          subtext: "Click to Open",
          icon: "textures/items/book_writable",
        },
        {
          text: "Account Linking",
          subtext: "Click to Open",
          icon: "textures/ui/teams_icon",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        player.sendError("Form closed.");
        break;
      case 0:
        Reports.Create(player);
        break;
      case 1:
        Transfer.View(player);
        break;
      case 2:
        Stats.View(player);
        break;
      case 3:
        Linking.View(player);
        break;
    }
  }
  public static async ServerInformationPage(player: Player): Promise<void> {
    const form = await Form.ActionForm({
      player: player,
      title: "§cServer Information",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nWhat would you like to do?\n\n`,
      buttons: [
        {
          text: "Server Rules",
          subtext: "Click to Open",
          icon: "textures/items/book_written",
        },
        {
          text: "Server Credits",
          subtext: "Click to Open",
          icon: "textures/ui/op.png",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        player.sendError("Form closed.");
        break;
      case 0:
        Rules.View(player);
        break;
      case 1:
        this.CreditsPage(player);
        break;
    }
  }

  private static async CreditsPage(player: Player): Promise<void> {
    const form = Form.ActionForm({
      player: player,
      title: "§cServer Credits",
      body: [
        `§7Server Credits:`,
        ``,
        `${
          Config.chat_rank_definitions.find((def) => def.id === "dev")?.name
        }§r§7:`,
        `§e Espryra`,
        `§e Zappy NE`,
        ``,
        `${
          Config.chat_rank_definitions.find((def) => def.id === "builder")?.name
        }§r§7:`,
        `§e mrtrex420`,
        // `§e Moderator2`,
        ``,
        `§l§c${
          Config.chat_rank_definitions.find((def) => def.id === "staff")?.name
        }§r§7:`,
        `§e OarisRose`,
        `§e Kazsey`,
        `§e Serial-V`,
      ].join("\n"),
      buttons: [],
    });
  }

  private static ForceUI(): void {
    system.runInterval(() => {
      const UIItem = new ItemStack(Config.ui_typeid, 1);

      UIItem.lockMode = ItemLockMode.inventory;
      UIItem.nameTag = Config.ui_nametag;
      UIItem.keepOnDeath = true;

      for (const player of world.getAllPlayers()) {
        const items = player
          .findItem(Config.ui_typeid)
          .filter((item) => item.slot !== EquipmentSlot.Mainhand);

        switch (true) {
          case items.length > 1:
            player.findItemAndDelete(Config.ui_typeid);
            player.addInventoryItem(UIItem);
            break;
          case items.length === 0:
            player.addInventoryItem(UIItem);
            break;
        }
      }
    }, Config.force_ui_interval);
  }
}
