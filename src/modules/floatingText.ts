import { system } from "@minecraft/server";
import Config from "../lib/config";
import World from "../utils/wrappers/world";

export default class FloatingText {
  public static async Init(): Promise<void> {
    this.Loop();
  }

  private static Loop(): void {
    system.runInterval(() => {
      const entities = World.Entities("valhalla:floating_text");
      const members = World.Members();

      for (const entity of entities) {
        const data = Config.floating_text.find((entry) =>
          entity.getTags().some((tag) => tag === entry.tag)
        );

        if (!data) {
          continue;
        }

        entity.nameTag = `§c${data.text}`
          .replaceAll("\n", "\n§c")
          .replaceAll("{{PLAYERSONLINE}}", members.length.toString())
          .replaceAll("{{MAXPLAYERS}}", Config.max_players.toString());
      }
    }, Config.floating_text_interval);
  }
}
