import {
  EquipmentSlot,
  ItemLockMode,
  ItemStack,
  system,
  type ItemUseAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import Form from "../utils/form/form";
import Member from "../utils/wrappers/member";
import World from "../utils/wrappers/world";
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

    UI.MainPage(new Member(player));
  }

  public static async MainPage(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cValhalla UI",
      body: `§7Welcome, §l§c${member.Username()}§r§7!\n\nWhat would you like to do?\n\n`,
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
        member.SendError("Form closed.");
        break;
      case 0:
        Warps.View(member);
        break;
      case 1:
        Plots.Redirector(member);
        break;
      case 2:
        this.PlayerInformationPage(member);
        break;
      case 3:
        this.ServerInformationPage(member);
        break;
      case 4:
        break;
      case 5:
        Moderation.View(member);
        break;
    }
  }
  public static async PlayerInformationPage(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cPlayer Information",
      body: `§7Hello, §l§c${member.Username()}§r§7!\n\nWhat would you like to do?\n\n`,
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
        member.SendError("Form closed.");
        break;
      case 0:
        Reports.Create(member);
        break;
      case 1:
        Transfer.View(member);
        break;
      case 2:
        Stats.View(member);
        break;
      case 3:
        Linking.View(member);
        break;
    }
  }
  public static async ServerInformationPage(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cServer Information",
      body: `§7Hello, §l§c${member.Username()}§r§7!\n\nWhat would you like to do?\n\n`,
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
        member.SendError("Form closed.");
        break;
      case 0:
        Rules.View(member);
        break;
      case 1:
        this.CreditsPage(member);
        break;
    }
  }

  private static async CreditsPage(member: Member): Promise<void> {
    const form = Form.ActionForm({
      member,
      title: "§cServer Credits",
      body: [
        `§7Server Credits:`,
        ``,
        `${Config.chat_rank_definitions.find((def) => def.id === "dev")?.name}§r§7:`,
        `§e Espryra`,
        `§e Zappy NE`,
        ``,
        `${Config.chat_rank_definitions.find((def) => def.id === "builder")?.name}§r§7:`,
        `§e mrtrex420`,
        // `§e Moderator2`,
        ``,
        `§l§c${Config.chat_rank_definitions.find((def) => def.id === "staff")?.name}§r§7:`,
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

      for (const member of World.Members()) {
        const items = member
          .FindItem(Config.ui_typeid)
          .filter((item) => item.slot !== EquipmentSlot.Mainhand);

        switch (true) {
          case items.length > 1:
            member.FindItemAndDelete(Config.ui_typeid);
            member.AddInventoryItem(UIItem);
            break;
          case items.length === 0:
            member.AddInventoryItem(UIItem);
            break;
        }
      }
    }, Config.force_ui_interval);
  }
}
