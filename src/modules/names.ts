import { system, world } from "@minecraft/server";
import Config from "../lib/config";
import Formatter from "../utils/formatter";

export default class Names {
  public static async Init(): Promise<void> {
    this.Loop();
  }

  private static UpdateItemNames(): void {
    for (const entity of world
      .overworld()
      .getEntities({ type: "minecraft:item" })) {
      const item = entity.getComponent("item")?.itemStack;

      if (!item) {
        continue;
      }

      const name = item.nameTag ?? Formatter.ReadableTypeId(item.typeId);

      entity.nameTag = `§c${name}§r\n§7[ §a${item.amount}§7/§c${item.maxAmount} §7]`;
    }
  }
  private static UpdatePlayerNames(): void {
    for (const player of world.getAllPlayers()) {
      const health = player.health();

      player.nameTag = `§c${
        player.name
      }\n§7[ :heart: §c${health.current.toFixed()}§7/§c${
        health.max
      } ǀ  ${player.getReach()} ǀ  ${player.getCPS()} §7]`;
      // add CPS and Reach later
    }
  }

  private static Loop(): void {
    system.runInterval(() => {
      this.UpdateItemNames();
      this.UpdatePlayerNames();
    }, Config.name_interval);
  }
}
