import Config from "../lib/config";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Sleep from "../utils/sleep";
import type Member from "../utils/wrappers/member";

export default class Warps {
  public static async View(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cWarps",
      body: `§7Hello, §l§c${member.Username()}§r§7!\n\nWhere would you like to do?\n\n`,
      buttons: Config.warps.map((warp) => {
        return {
          text: warp.name,
          subtext: "Click to Teleport",
          icon: warp.icon,
        };
      }),
    });

    if (form.selection === undefined) {
      member.SendError("Form closed.");
      return;
    }

    const warp = Config.warps[form.selection];

    if (!warp) {
      member.SendError("Warp not found.");
      return;
    }

    const currentZone = Config.zones.find((entry) => member.HasTag(entry.tag));

    for (const entry of Config.zones) {
      member.RemoveTag(entry.tag);
    }

    if (Cache.CombatTime[member.EntityID()]) {
      member.SendError("You cannot teleport while in combat!");

      if (currentZone) {
        member.AddTag(currentZone.tag);
      }

      return;
    } else {
      await member.FadeCamera();

      member.Teleport(warp.location);

      member.AddEffect("resistance", 20 * 3, 255);
      member.AddEffect("weakness", 20 * 3, 255);

      await Sleep(20);
    }

    member.AddTag(warp.tag);
    member.SendSuccess(`Successfully teleported to §l${warp.name}§r§a!`);
  }
}
