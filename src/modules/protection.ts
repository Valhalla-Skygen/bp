import {
  EntityDieAfterEvent,
  GameMode,
  Player,
  PlayerInteractWithBlockBeforeEvent,
  system,
  type PlayerSpawnAfterEvent,
} from "@minecraft/server";
import Config from "../lib/config";
import Cache from "../utils/cache";
import Location from "../utils/location";
import World from "../utils/wrappers/world";

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
      const members = World.Members().filter((member) =>
        member.HasTag("spawn")
      );

      for (const member of members) {
        member.AddEffect("speed", 20, 5);
      }
    });
  }
  private static ZoneLoop(): void {
    system.runInterval(() => {
      const members = World.Members();

      for (const zone of Config.zones) {
        const entities = World.Overworld().getEntities({
          location: zone.location,
          type: "minecraft:player",
          maxDistance: zone.radius,
          tags: [zone.tag],
        });
        const targets = members.filter((member) => member.HasTag(zone.tag));

        for (const target of targets) {
          const profile = Cache.Profiles.find(
            (entry) => entry.entity_id === target.EntityID()
          );

          if (profile && profile.admin) {
            continue;
          }
          if (!entities.some((entity) => entity.id === target.EntityID())) {
            target.Teleport(zone.location);
            target.SendWarning(
              "You have left the zone, and have been teleported!"
            );
          }
        }
      }
    }, Config.zone_interval);
  }
}
