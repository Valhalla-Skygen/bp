import type { Player } from "@minecraft/server";
import {
  ActionFormData,
  ModalFormData,
  ModalFormResponse,
  type ActionFormResponse,
} from "@minecraft/server-ui";
import type {
  ActionForm,
  ChestForm,
  ChestFormItem,
  ModalForm,
} from "../../types/form";
import { ChestFormData } from "./chestUI/forms";

export default class Form {
  public static async ActionForm(
    data: ActionForm
  ): Promise<ActionFormResponse> {
    const { player, buttons, body, title } = data;
    const form = new ActionFormData();

    if (title) form.title(title);
    if (body) form.body(body);

    for (const button of buttons) {
      const { text, icon, subtext } = button;

      form.button(
        "§c" + text + "§r" + (subtext ? `\n§7[ ${subtext}§r §7]` : ""),
        icon
      );
    }

    return await form.show(player);
  }
  public static async ModalForm(data: ModalForm): Promise<ModalFormResponse> {
    const { player, options, title } = data;
    const form = new ModalFormData();

    if (title) form.title(title);

    for (const option of options) {
      const { type } = option;

      switch (type) {
        case "label":
          form.label(option.label);
          break;
        case "header":
          form.header(option.header);
          break;
        case "toggle":
          form.toggle(option.label, {
            defaultValue: option.default,
            tooltip: option.tooltip,
          });
          break;
        case "textfield":
          form.textField(option.label, option.ghost, {
            tooltip: option.tooltip,
            defaultValue: option.default,
          });
          break;
        case "dropdown":
          form.dropdown(option.label, option.options, {
            tooltip: option.tooltip,
            defaultValueIndex: option.default,
          });
          break;
        case "slider":
          form.slider(option.label, option.min, option.max, {
            tooltip: option.tooltip,
            defaultValue: option.default,
            valueStep: option.step,
          });
      }
    }

    return await form.show(player);
  }
  /**
   * This will require you to have the chestUI resource pack installed!
   */
  public static async ChestForm(data: ChestForm): Promise<ActionFormResponse> {
    const form = new ChestFormData(data.size);

    if (data.title) {
      form.title("§l§c" + data.title);
    }
    if (data.pattern) {
      const keys: Record<string, ChestFormItem> = {};

      for (const key of data.pattern.keys) {
        keys[key.character] = {
          ...key,
        };
      }

      form.pattern(data.pattern.lines, keys);
    }
    if (data.buttons) {
      for (const button of data.buttons) {
        form.button(
          button.slot,
          button.itemName,
          button.itemDescription ?? [],
          button.texture,
          button.stackSize,
          button.durability,
          button.enchanted
        );
      }
    }

    return form.show(data.player);
  }
  public static BaseChestOptions(player: Player): ChestForm {
    return {
      player: player,
      size: "large",
      title: "Base Chest UI",
      pattern: {
        lines: [
          "xxxxxxxxxx",
          "xxxxxxxxxx",
          "xxxxxxxxxx",
          "xxxxxxxxxx",
          "xxxxxxxxxx",
          "xxxxxxxxxx",
        ],
        keys: [
          {
            character: "x",
            durability: 0,
            enchanted: false,
            itemDescription: [],
            itemName: "",
            stackSize: 1,
            texture: "textures/blocks/glass_black",
          },
        ],
      },
    };
  }
}
