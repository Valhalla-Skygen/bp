import { system, world } from "@minecraft/server";
import Config from "../lib/config";
import Cache from "../utils/cache";
import Formatter from "../utils/formatter";

export default class Sidebar {
  private static tick = 0;
  private static readonly ANIM_COLORS_DISCORD = ["§b", "§3", "§9", "§3", "§b"];
  private static readonly ANIM_COLORS_IP = [
    "§m",
    "§4",
    "§c",
    "§v",
    "§6",
    "§p",
    "§g",
    "§e",
    "§g",
    "§p",
    "§6",
    "§v",
    "§c",
    "§4",
  ];

  public static async Init(): Promise<void> {
    this.Loop();
  }

  private static Display(): void {
    for (const player of world.getAllPlayers()) {
      const profile = Cache.Profiles.find(
        (profile) => profile.entity_id === player.id
      );
      const plotMember = Cache.PlotMembers.find(
        (plot) => plot.entity_id === player.id
      );
      const plot = Cache.Plots.find((plot) => plot._id === plotMember?.plot_id);
      const plotLoaded = !plot ? "§cNot Loaded!" : `§aPlot ${plot.slot}`;

      const kills = profile?.kills ?? 0;
      const deaths = profile?.deaths ?? 0;
      const killstreak = profile?.killstreak ?? 0;
      const streakString = `§f${killstreak}§7/§f${
        profile?.killstreak_highest ?? 0
      }`;
      const ratio = (kills / (deaths === 0 ? 1 : deaths)).toFixed(2);
      const KDR = `§f${kills}§7/§f${deaths}§7 §7(§f${ratio}§7)`;
      const balance = Formatter.ToShort(profile?.balance ?? 0);
      const blocksMined = Formatter.ToShort(profile?.blocks_mined ?? 0);
      const souls = profile?.souls ?? 0;
      const playtime = Formatter.TimePlayed(profile?.time_played ?? 0, true);
      const combo = Number(player.getCombo() ?? 0);
      const cps = Number(player.getCPS() ?? 0);

      // Animated footer
      const discordRaw = ".gg/Tmmv3mHQv3";
      const ipRaw = "valhalla-mc.online";
      const discordAnim = this.Animate(discordRaw, this.tick);
      const ipAnim = this.RainbowShift(ipRaw, this.tick);

      player.onScreenDisplay.setTitle(
        [
          `§m╔══════════╗`,
          `§m╠ §e${profile?.username}`,
          `§m╠§6 §7» ${plotLoaded}`,
          `§m║----------------`,
          `§m╠§6 §7» §f${souls}`,
          `§m╠§6 §7» §a$${balance}`,
          `§m╠§6 §7» §f${playtime}`,
          `§m╠§6 §7» §f${blocksMined}`,
          `§m║----------------`,
          `§m╠§6 §7» ${KDR}`,
          `§m╠§6 §7» ${streakString}`,
          `§m║----------------`,
          `§m╠§6 §7» §f${combo}`,
          `§m╠§6 §7» §f${cps}`,
          `§m╚══════════╝`,
          ``,
          `§8 §f${world.getAllPlayers().length}§7/§f${Config.max_players}`,
          `§8§9 ${discordAnim}`,
          `§8 §e${ipAnim}`,
          // ``,
          // ``,
        ].join("\n")
      );
    }

    // increment tick every couple of game ticks
    if (system.currentTick % 8 == 0) this.tick++;
  }

  private static Animate(text: string, tick: number): string {
    const colors = this.ANIM_COLORS_DISCORD;
    const len = colors.length;
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === " ") {
        out += ch;
        continue;
      }
      const color = colors[(tick + i) % len] || "§f";
      out += color + ch;
    }
    return out;
  }

  private static RainbowShift(text: string, tick: number): string {
    // Shifts color across the string left->right each frame
    const colors = this.ANIM_COLORS_IP;
    const len = colors.length;
    let out = "";

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch === " ") {
        out += ch;
        continue;
      }

      const color = colors[(tick + (text.length - i)) % len] || "§f";
      out += color + ch;
    }

    return out;
  }

  private static Loop(): void {
    system.runInterval(() => {
      this.Display();
    }, Config.sidebar_interval);
  }
}
