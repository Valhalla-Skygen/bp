import type { Player } from "@minecraft/server";
import Form from "../utils/form/form";

export default class Rules {
  public static async View(player: Player): Promise<void> {
    const form = Form.ActionForm({
      player,
      title: "§cServer Rules",
      body: [
        `§7Here are the server rules.`,
        `§l§c1§r§7 - §eNo griefing unless base is not possible to leave/enter.`,
        `§l§c2§r§7 - §eNo Hacking`,
        `§l§c3§r§7 - §eNo Exploiting. If you find an exploit, please report it and you may receive a reward.`,
        `§l§c4§r§7 - §eNo unnecessary chat spamming`,
        `§l§c5§r§7 - §eNo advertising`,
        `§l§c6§r§7 - §eNo gen placing at base doors`,
        `§l§c7§r§7 - §eNo hitting in spawn`,
      ].join("\n"),
      buttons: [],
    });
  }
}
