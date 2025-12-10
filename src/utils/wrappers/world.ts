import * as server from "@minecraft/server";
import Config from "../../lib/config";
import type { InventoryItem } from "../../types/wrappers";
import Sleep from "../sleep";
import UUID from "../UUID";
import Member from "./member";

export default class World {
  public static Overworld(): server.Dimension {
    return server.world.getDimension("overworld");
  }
  public static Nether(): server.Dimension {
    return server.world.getDimension("nether");
  }
  public static End(): server.Dimension {
    return server.world.getDimension("the_end");
  }

  public static StructureManager(): server.StructureManager {
    return server.world.structureManager;
  }

  public static RunCommand(
    command: string,
    dimension = this.Overworld()
  ): void {
    dimension.runCommand(command);
  }

  public static Members(): Member[] {
    return server.world.getAllPlayers().map((player) => new Member(player));
  }
  public static FindMember(entity_id: string): Member | undefined {
    return this.Members().find((member) => member.EntityID() === entity_id);
  }

  public static Entities(
    typeId?: string,
    dimension = this.Overworld()
  ): server.Entity[] {
    return dimension.getEntities({ type: typeId });
  }
  public static EntitiesAtLocation(
    location: server.Vector3,
    typeId?: string,
    dimension = this.Overworld()
  ): server.Entity[] {
    return dimension.getEntities({ type: typeId, location });
  }
  public static EntityCount(dimension = this.Overworld()): number {
    return this.Entities(undefined, dimension).length;
  }

  public static async LoadArea(location: server.Vector3): Promise<string> {
    const id = UUID.V4();

    this.RunCommand(
      `tickingarea add circle ${location.x} ${location.y} ${location.z} 4 "${id}"`
    );

    await Sleep(100);

    return id;
  }
  public static UnloadArea(id: string): void {
    this.RunCommand(`tickingarea remove "${id}"`);
  }

  public static SetProperty<T>(id: string, data?: Partial<T>): void {
    server.world.setDynamicProperty(id, JSON.stringify(data));
  }
  public static GetProperty<T>(id: string): T | undefined {
    const raw = server.world.getDynamicProperty(id) as any;

    if (!raw) {
      return undefined;
    }

    return JSON.parse(raw) as T;
  }
  public static PropertyKeys(filter?: string): string[] {
    const keys = server.world.getDynamicPropertyIds();

    if (!filter) {
      return keys;
    }

    return keys.filter((key) => key.startsWith(filter));
  }

  public static GetBlock(
    location: server.Vector3,
    dimension = this.Overworld()
  ): server.Block | undefined {
    return dimension.getBlock(location);
  }
  public static GetContainer(
    location: server.Vector3,
    dimension = this.Overworld()
  ): server.Container | undefined {
    const block = this.GetBlock(location, dimension);

    if (!block) {
      return undefined;
    }

    return block.getComponent("inventory")?.container;
  }
  public static GetContainerItems(
    location: server.Vector3,
    dimension = this.Overworld()
  ): InventoryItem[] {
    const container = this.GetContainer(location, dimension);
    const items: InventoryItem[] = [];

    if (!container) {
      return items;
    }

    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);

      if (!item) {
        continue;
      }

      items.push({
        data: item,
        slot: i,
      });
    }

    return items;
  }

  public static PlaySound(
    sound: keyof typeof Config.sounds,
    pitch?: number
  ): void {
    for (const member of this.Members()) {
      member.PlaySound(sound, pitch);
    }
  }

  public static Broadcast(message: string): void {
    for (const member of this.Members()) {
      member.SendMessage(message);
    }
  }
  public static BroadcastInfo(message: string): void {
    this.Broadcast(Config.colors.info + message);
    this.PlaySound("info");
  }
  public static BroadcastSuccess(message: string): void {
    this.Broadcast(Config.colors.success + message);
    this.PlaySound("success");
  }
  public static BroadcastWarning(message: string): void {
    this.Broadcast(Config.colors.warning + message);
    this.PlaySound("warning");
  }
  public static BroadcastError(message: string): void {
    this.Broadcast(Config.colors.error + message);
    this.PlaySound("error");
  }

  public static SpawnItem(
    item: server.ItemStack,
    location: server.Vector3,
    dimension = this.Overworld()
  ): void {
    dimension.spawnItem(item, location);
  }
}
