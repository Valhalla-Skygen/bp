import type { Player } from "@minecraft/server";
import Config from "../lib/config";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Sleep from "../utils/sleep";

export default class Warps {
  public static async View(player: Player): Promise<void> {
    const form = await Form.ActionForm({
      player,
      title: "§cWarps",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nWhere would you like to do?\n\n`,
      buttons: Config.warps.map((warp) => {
        return {
          text: warp.name,
          subtext: "Click to teleport",
          icon: warp.icon,
        };
      }),
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    const warp = Config.warps[form.selection];

    if (!warp) {
      player.sendError("Warp not found.");
      return;
    }

    const currentZone = Config.zones.find((entry) => player.hasTag(entry.tag));

    for (const entry of Config.zones) {
      player.removeTag(entry.tag);
    }

    if (Cache.CombatTime[player.id]) {
      player.sendError("You cannot teleport while in combat!");

      if (currentZone) {
        player.addTag(currentZone.tag);
      }

      return;
    } else {
      await player.fadeCamera();

      player.teleport(warp.location);

      player.addEffect("resistance", 20 * 3, { amplifier: 255 });
      player.addEffect("weakness", 20 * 3, { amplifier: 255 });

      await Sleep(20);
    }

    player.addTag(warp.tag);
    player.sendSuccess(`Successfully teleported to §l${warp.name}§r§a!`);
  }
}
