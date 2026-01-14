import {
  Player,
  system,
  type PlayerInteractWithBlockBeforeEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import type { Crate } from "../types/crates";
import type { ChestFormButton } from "../types/form";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Location from "../utils/location";

export default class Crates {
  private constructor() {}

  public static async OnInteract(
    event: PlayerInteractWithBlockBeforeEvent
  ): Promise<void> {
    const { player, block, isFirstEvent } = event;

    if (!isFirstEvent || block.typeId !== "minecraft:chest") {
      return;
    }

    const crate = Config.crates.find((crate) =>
      Location.Same(crate.location, block.location, true)
    );

    if (!crate) {
      return;
    }
    if (crate.rewards.length < 1) {
      system.run(() => player.sendError("This crate has no rewards!"));
      return;
    }

    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === player.id
    );

    event.cancel = true;

    if (!profile) {
      system.run(() => player.sendError("Could not find your profile!"));
      return;
    }

    const keys = profile[crate.currency_key as keyof typeof profile] as number;

    if (keys < 1) {
      system.run(() =>
        player.sendError(`You have no keys for the ${crate.name}!`)
      );
      return;
    }

    system.run(() => this.ViewCrate(player, crate));
  }

  public static async ViewCrate(player: Player, crate: Crate): Promise<void> {
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === player.id
    )!;
    const keys = profile[crate.currency_key as keyof typeof profile] as number;
    const form = await Form.ChestForm({
      player,
      size: "double",
      title: crate.name,
      pattern: {
        lines: [
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
          "xxxxxxxxx",
          "yyyyyyyyy",
        ],
        keys: [
          {
            character: "x",
            itemName: "",
            texture: "textures/blocks/glass_black",
          },
          {
            character: "y",
            itemName: "",
            texture: "textures/blocks/glass_red",
          },
        ],
      },
      buttons: [
        ...crate.rewards
          .map((reward, index) => {
            return {
              itemName: "§l§c" + reward.name,
              slot: index,
              texture: reward.display_item.typeId,
              enchanted: true,
              itemDescription: reward.description,
              stackSize: reward.display_item.amount,
            } as ChestFormButton;
          })
          .slice(0, 45),
        {
          slot: 53,
          itemName: `§c§l${keys} §r§7${crate.name} Keys`,
          itemDescription: [
            ``,
            `§7You earn these keys by random, such as from mining blocks,`,
            `killing players, and other actions around the server.`,
          ],
          stackSize: keys,
          texture: "minecraft:tripwire_hook",
        },
        {
          slot: 49,
          itemName: "§aUse a Key",
          itemDescription: ["", "§7Use one of your keys to open this crate."],
          texture: "minecraft:emerald_block",
        },
      ],
    });

    if (form.canceled) {
      return;
    }
    if (form.selection !== 49) {
      this.ViewCrate(player, crate);
      return;
    }
  }
}
