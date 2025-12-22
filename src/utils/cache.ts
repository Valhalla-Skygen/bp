import { system, world } from "@minecraft/server";
import Config from "../lib/config";
import type { Profile } from "../types/API";
import type { Plot, PlotMember } from "../types/plots";
import API from "./API/API";
import Logger from "./logger";

export default class Cache {
  public static Profiles: Profile[] = [];
  public static Plots: Plot[] = [];
  public static PlotMembers: PlotMember[] = [];
  public static CPS: Record<string, number[]> = {};
  public static Reach: Record<string, number> = {};
  public static Combo: Record<string, number> = {};
  public static CombatTime: Record<string, number> = {};
  public static ChatMessages: Record<string, number> = {};
  public static PlotLoadCooldown: Record<string, Date> = {};

  public static async Init(): Promise<void> {
    system.run(() => this.Update());

    this.ChatLoop();
    this.CombatLoop();
    this.UpdateLoop();
  }

  private static async Update(): Promise<void> {
    const players = world.getAllPlayers();
    const profiles = await API.Profiles.Online(
      players.map((player) => player.id)
    );
    const plots = await API.Plots.ActivePlots();
    const plotMembers = await API.Plots.ActiveMembers(
      players.map((player) => player.id)
    );

    if (!plots.data || !plotMembers.data || !profiles.data) {
      Logger.Error("Failed to update cache.");
      return;
    }

    Cache.Profiles = profiles.data;
    Cache.Plots = plots.data;
    Cache.PlotMembers = plotMembers.data;
  }

  private static ChatLoop(): void {
    system.runInterval(() => {
      this.ChatMessages = {};
    }, Config.chat_period);
  }
  private static CombatLoop(): void {
    system.runInterval(() => {
      for (const [entity_id, time] of Object.entries(this.CombatTime)) {
        const player = world.findPlayer(entity_id);

        if (!player) {
          delete this.CombatTime[entity_id];
          continue;
        }
        if (time - 1 === 0) {
          delete this.CombatTime[entity_id];

          player.playSound("note.harp");
          player.onScreenDisplay.setActionBar([
            Config.colors.warning + "You have left combat!",
          ]);
          continue;
        }

        this.CombatTime[entity_id] = time - 1;

        player.onScreenDisplay.setActionBar([
          Config.colors.warning + `${time - 1} seconds left in combat!`,
        ]);
      }
    }, 20);
  }
  private static UpdateLoop(): void {
    system.runInterval(() => {
      this.Update();
    }, Config.cache_speed);
  }
}
