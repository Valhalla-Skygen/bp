import { system } from "@minecraft/server";
import Config from "../lib/config";
import type { Profile } from "../types/API";
import type { Plot, PlotMember } from "../types/plots";
import API from "./API/API";
import Logger from "./logger";
import World from "./wrappers/world";

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
    const members = World.Members();
    const profiles = await API.Profiles.Online(
      members.map((member) => member.EntityID())
    );
    const plots = await API.Plots.ActivePlots();
    const plotMembers = await API.Plots.ActiveMembers(
      members.map((member) => member.EntityID())
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
        const member = World.FindMember(entity_id);

        if (!member) {
          delete this.CombatTime[entity_id];
          continue;
        }
        if (time - 1 === 0) {
          delete this.CombatTime[entity_id];

          member.PlaySound("warning");
          member.ActionBar([Config.colors.warning + "You have left combat!"]);
          continue;
        }

        this.CombatTime[entity_id] = time - 1;

        member.ActionBar([
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
