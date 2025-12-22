import {
  EntityDieAfterEvent,
  GameMode,
  Player,
  PlayerInteractWithBlockBeforeEvent,
  system,
  world,
  type PlayerSpawnAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import Cache from "../utils/cache";
import Location from "../utils/location";

export default class Protection {
  public static async Init(): Promise<void> {
    this.SpawnEffects();
    this.ZoneLoop();
  }

  public static async OnSpawn(event: PlayerSpawnAfterEvent): Promise<void> {
    const { player } = event;
    const tags = player.getTags();

    for (const zone of Config.zones) {
      if (!tags.includes(zone.tag)) {
        continue;
      }

      player.removeTag(zone.tag);
    }

    player.addTag("spawn");
    player.setGameMode(GameMode.Adventure);
  }
  public static OnDeath(event: EntityDieAfterEvent): void {
    const { deadEntity: player } = event;

    if (!(player instanceof Player)) {
      return;
    }

    for (const zone of Config.zones) {
      player.removeTag(zone.tag);
    }

    // No point in adding spawn tag, as spawn event adds it anyways.
  }
  public static OnInteraction(event: PlayerInteractWithBlockBeforeEvent): void {
    if (event.cancel) {
      return;
    }

    const { player, block } = event;
    const plot = Config.plot_slots.find((entry) =>
      Location.Inside(entry.saveZone, block.location)
    );

    if (plot) {
      return;
    }

    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === player.id
    );

    if (profile && profile.admin) {
      return;
    }

    event.cancel = true;
  }

  private static SpawnEffects(): void {
    system.runInterval(() => {
      const members = world
        .getAllPlayers()
        .filter((player) => player.hasTag("spawn"));

      for (const player of members) {
        player.addEffect("speed", 20, { amplifier: 5 });
      }
    });
  }
  private static ZoneLoop(): void {
    system.runInterval(() => {
      const players = world.getAllPlayers();

      for (const zone of Config.zones) {
        const entities = world.overworld().getEntities({
          location: zone.location,
          type: "minecraft:player",
          maxDistance: zone.radius,
          tags: [zone.tag],
        });
        const targets = players.filter((member) => member.hasTag(zone.tag));

        for (const target of targets) {
          const profile = Cache.Profiles.find(
            (entry) => entry.entity_id === target.id
          );

          if (profile && profile.admin) {
            continue;
          }
          if (!entities.some((entity) => entity.id === target.id)) {
            target.teleport(zone.location);
            target.sendWarning(
              "You have left the zone, and have been teleported!"
            );
          }
        }
      }
    }, Config.zone_interval);
  }
}
