import { system } from "@minecraft/server";
import Config from "../lib/config";
import Formatter from "../utils/formatter";
import World from "../utils/wrappers/world";

export default class Names {
  public static async Init(): Promise<void> {
    this.Loop();
  }

  private static UpdateItemNames(): void {
    for (const entity of World.Entities("minecraft:item")) {
      const item = entity.getComponent("item")?.itemStack;

      if (!item) {
        continue;
      }

      const name = item.nameTag ?? Formatter.ReadableTypeId(item.typeId);

      entity.nameTag = `§c${name}§r\n§7[ §a${item.amount}§7/§c${item.maxAmount} §7]`;
    }
  }
  private static UpdatePlayerNames(): void {
    for (const member of World.Members()) {
      const health = member.Health();

      member.Player().nameTag = `§c${member.Username()}\n§7[ :heart: §c${health.current.toFixed()}§7/§c${health.max} ǀ  ${member.GetReach()} ǀ  ${member.GetCPS()} §7]`;
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
