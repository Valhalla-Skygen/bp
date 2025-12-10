import { EntitySpawnAfterEvent, system } from "@minecraft/server";
import Config from "../lib/config";
import type { LagClearMessage } from "../types/lagClear";
import Sleep from "../utils/sleep";
import World from "../utils/wrappers/world";

export default class LagClear {
  public static async Init(): Promise<void> {
    this.CheckLoop();
  }

  public static OnSpawn(event: EntitySpawnAfterEvent): void {
    const { entity } = event;

    if (Config.lag_clear_blacklist.includes(entity.typeId)) {
      entity.remove();
      return;
    }
    if (entity.typeId === "minecraft:item") {
      const item = entity.getComponent("item")?.itemStack;

      if (!item) {
        return;
      }

      if (item.nameTag === Config.starter_kit_name) {
        entity.remove();
      }
    }
  }

  private static CheckLoop(): void {
    system.runInterval(async () => {
      const entities = World.Entities().filter((entity) =>
        Config.lag_clear_entities.includes(entity.typeId)
      );

      if (entities.length < Config.lag_clear_threshold) {
        return;
      }

      for (let i = 0; i < Config.lag_clear_countdown.length; i++) {
        const data = Config.lag_clear_countdown[i] as LagClearMessage;

        World.BroadcastWarning(data.message);

        await Sleep(data.delay);
      }

      for (const entity of entities) {
        try {
          entity.remove();
        } catch {}
      }

      World.BroadcastSuccess(
        `Successfully cleared ${entities.length} total entities!`
      );
    }, Config.lag_clear_check_inverval);
  }
}
