import { system } from "@minecraft/server";
import Config from "../lib/config";
import type { LeaderboardType } from "../types/leaderboards";
import API from "../utils/API/API";
import Formatter from "../utils/formatter";
import Logger from "../utils/logger";
import World from "../utils/wrappers/world";

export default class Leaderboards {
  public static async Init(): Promise<void> {
    this.Loop();
  }

  private static Loop(): void {
    system.runInterval(async () => {
      const entities = World.Entities("valhalla:floating_text");
      const { data: leaderboards } = await API.Leaderboards.GetLeaderboards();

      if (!leaderboards) {
        Logger.Error("Failed to get leaderboards.");
        return;
      }

      for (const [type, entries] of Object.entries(leaderboards)) {
        switch (type as LeaderboardType) {
          case "timePlayed":
            for (const entity of entities.filter((entity) =>
              entity.hasTag(type)
            )) {
              entity.nameTag = `§8=========================\n§c§lTime Played\n${entries
                .map(
                  (entry, index) =>
                    `§7#${index + 1}§7 - §c${
                      entry.username
                    } §7- §e${Formatter.TimePlayed(entry.value)}`
                )
                .join("\n")}\n§8=========================`;
            }
            break;
          default:
            for (const entity of entities.filter((entity) =>
              entity.hasTag(type)
            )) {
              entity.nameTag = `§8=========================\n§c§l${
                type[0]?.toUpperCase() + type.slice(1)
              }\n${entries
                .map(
                  (entry, index) =>
                    `§7#${index + 1}§7 - §c${
                      entry.username
                    } §7- §e${Formatter.ToShort(entry.value)}`
                )
                .join("\n")}\n§8=========================`;
            }
            break;
        }
      }
    }, Config.leaderboard_interval);
  }
}
