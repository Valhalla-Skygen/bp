import {
  EntityDieAfterEvent,
  EntityHitEntityAfterEvent,
  EntityHurtAfterEvent,
  Player,
  PlayerBreakBlockAfterEvent,
  PlayerSpawnAfterEvent,
  system,
  type PlayerLeaveAfterEvent,
} from "@minecraft/server";
import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Formatter from "../utils/formatter";
import TargetFinder from "../utils/targetFinder";
import Member from "../utils/wrappers/member";
import World from "../utils/wrappers/world";

export default class Stats {
  public static async Init(): Promise<void> {
    this.TimePlayed();
  }

  public static async OnSpawn(event: PlayerSpawnAfterEvent): Promise<void> {
    const { initialSpawn, player } = event;

    if (!initialSpawn) {
      return;
    }

    const member = new Member(player);
    const profile = await API.Profiles.Profile(member.EntityID());

    if (!profile.data) {
      await API.Profiles.Create({
        entity_id: member.EntityID(),
        username: member.Username(),
      });

      member.ClearAll();

      World.BroadcastInfo(
        `<${member.Username()}> joined the server for the first time!`
      );
      return;
    }

    API.Profiles.Update(member.EntityID(), {
      username: member.Username(),
      last_login: new Date(),
    });
  }
  public static async OnLeave(event: PlayerLeaveAfterEvent): Promise<void> {
    const { playerId: entity_id } = event;

    API.Profiles.Update(entity_id, {
      last_login: new Date(),
    });
  }
  public static async OnDeath(event: EntityDieAfterEvent): Promise<void> {
    const {
      damageSource: { damagingEntity: source },
      deadEntity: target,
    } = event;

    if (!(source instanceof Player) || !(target instanceof Player)) {
      return;
    }

    const sourceMember = new Member(source);

    sourceMember.AddEffect("instant_health", 20, 255);

    API.Profiles.Death(target.id);
    API.Profiles.Kill(source.id);
  }
  public static async OnHit(event: EntityHitEntityAfterEvent): Promise<void> {
    const { damagingEntity: sourcePlayer, hitEntity: targetPlayer } = event;

    if (
      !(sourcePlayer instanceof Player) ||
      !(targetPlayer instanceof Player)
    ) {
      return;
    }

    const source = new Member(sourcePlayer);
    const target = new Member(targetPlayer);

    source.AddCPS();
    source.SetReach(target.Location());

    delete Cache.Combo[target.EntityID()];
  }
  public static async OnBreak(
    event: PlayerBreakBlockAfterEvent
  ): Promise<void> {
    const { player } = event;

    API.Profiles.AddBlocksMined(player.id);
  }
  public static OnHurt(event: EntityHurtAfterEvent): void {
    const {
      damageSource: { damagingEntity: source },
      hurtEntity: target,
    } = event;

    if (!(source instanceof Player) || !(target instanceof Player)) {
      return;
    }

    const sourceMember = new Member(source);

    sourceMember.AddCombo();
  }

  public static async View(member: Member): Promise<void> {
    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }

    Form.ActionForm({
      member,
      title: "§cStatistics",
      body: [
        `§7Here is §c${target.username}§7's stats.\n`,
        `§l§cCurrencies§r§7:`,
        `§7Souls: §c${Number(Formatter.ToShort(target.souls)).toFixed()}`,
        `§7Balance: §c$${Formatter.ToShort(target.balance)}\n`,
        `§l§cCombat§r§7:`,
        `§7Kills: §c${Formatter.ToComma(target.kills)}`,
        `§7Deaths: §c${Formatter.ToComma(target.deaths)}`,
        `§7Killstreak: §c${Formatter.ToComma(target.killstreak)}`,
        `§7Killstreak Highest: §c${Formatter.ToComma(target.killstreak_highest)}\n`,
        `§l§cGeneral§r§7:`,
        `§7Blocks Mined: §c${Formatter.ToComma(target.blocks_mined)}`,
        `§7Joined: §c${new Date(target.created_at).toDateString()}`,
        `§7Last Login: §c${new Date(target.last_login).toDateString()}`,
        `§7Time Played: §c${Formatter.TimePlayed(target.time_played)}`,
      ].join("\n"),
      buttons: [],
    });
  }

  private static TimePlayed(): void {
    system.runInterval(async () => {
      API.Profiles.TimePlayed(
        World.Members().map((member) => member.EntityID())
      );
    }, 20 * 60);
  }
}
