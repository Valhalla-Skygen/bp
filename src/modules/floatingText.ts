import { system, world } from "@minecraft/server";
import Config from "../lib/config";

export default class FloatingText {
  public static async Init(): Promise<void> {
    this.Loop();
  }

  private static Loop(): void {
    system.runInterval(() => {
      const entities = world
        .overworld()
        .getEntities({ type: "valhalla:floating_text" });
      const players = world.getAllPlayers();

      for (const entity of entities) {
        const data = Config.floating_text.find((entry) =>
          entity.getTags().some((tag) => tag === entry.tag)
        );

        if (!data) {
          continue;
        }

        entity.nameTag = `§c${data.text}`
          .replaceAll("\n", "\n§c")
          .replaceAll("{{PLAYERSONLINE}}", players.length.toString())
          .replaceAll("{{MAXPLAYERS}}", Config.max_players.toString());
      }
    }, Config.floating_text_interval);
  }
}
