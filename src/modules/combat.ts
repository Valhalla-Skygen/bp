import {
  Player,
  PlayerLeaveAfterEvent,
  PlayerSpawnAfterEvent,
  system,
  world,
  type EntityHitEntityAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import API from "../utils/API/API";
import Cache from "../utils/cache";
import Logger from "../utils/logger";

export default class Combat {
  public static async Init(): Promise<void> {
    this.CPSLimiter();
  }

  public static async OnLeave(event: PlayerLeaveAfterEvent): Promise<void> {
    const { playerId, playerName } = event;

    if (!Cache.CombatTime[playerId]) {
      return;
    }

    const request = await API.Moderation.CreateWarning(playerId, {
      staff: "SYSTEM",
      reason: "Combat Logged",
      method: "system",
    });

    if (request.status === 200) {
      world.broadcastWarning(
        `§l§c${playerName}§r§7 combat logged and has been punished!`
      );
    } else {
      Logger.Error(
        `Could not warn ${playerName} for combat logging:`,
        request.status
      );
    }

    delete Cache.CombatTime[playerId];
  }
  public static OnSpawn(event: PlayerSpawnAfterEvent): void {
    const { player } = event;

    if (!Cache.CombatTime[player.id]) {
      return;
    }

    delete Cache.CombatTime[player.id];
  }
  public static OnHit(event: EntityHitEntityAfterEvent): void {
    const { damagingEntity: source, hitEntity: target } = event;

    if (!(source instanceof Player) || !(target instanceof Player)) {
      return;
    }

    [source, target].forEach((player) => {
      const zone = Config.zones.find((zone) => player.hasTag(zone.tag));

      if (zone?.safe) {
        return;
      }
      if (!Cache.CombatTime[player.id]) {
        player.sendWarning("You have just entered combat!");
      }

      Cache.CombatTime[player.id] = Config.combat_time;
    });
  }

  private static CPSLimiter(): void {
    system.runInterval(() => {
      for (const player of world.getAllPlayers()) {
        const CPS = player.getCPS();

        switch (true) {
          case CPS < Config.cps_limit && player.hasTag("cps"):
            player.removeTag("cps");
            player.sendSuccess("You are no longer CPS limited!");
            break;
          case CPS >= Config.cps_limit && !player.hasTag("cps"):
            player.addTag("cps");
            player.sendWarning(`You have been CPS limited! (${CPS} CPS)`);
            break;
        }
      }
    }, Config.cps_limiter_interval);
  }
}
