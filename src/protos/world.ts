import { Dimension, ItemStack, World } from "@minecraft/server";
import UUID from "../utils/UUID";
import Sleep from "../utils/sleep";

declare module "@minecraft/server" {
  interface World {
    // General
    runCommand(command: string, dimension?: Dimension): void;

    // Dimensions
    overworld(): Dimension;
    nether(): Dimension;
    end(): Dimension;

    // Players
    findPlayer(id: string): Player | undefined;

    // Entities
    entityCount(dimension?: Dimension): number;

    // Ticking Areas
    loadArea(location: Vector3): Promise<string>;
    unloadArea(id: string): void;

    // Blocks
    getContainer(
      location: Vector3,
      dimension?: Dimension
    ): Container | undefined;
    getContainerItems(location: Vector3, dimension?: Dimension): ItemStack[];

    // Broadcasting
    broadcast(message: string): void;
    broadcastInfo(message: string): void;
    broadcastSuccess(message: string): void;
    broadcastWarning(message: string): void;
    broadcastError(message: string): void;
  }
}

// General
World.prototype.runCommand = function (command, dimension) {
  (dimension ?? this.overworld()).runCommand(command);
};

// Dimensions
World.prototype.overworld = function (): Dimension {
  return this.getDimension("overworld");
};
World.prototype.nether = function (): Dimension {
  return this.getDimension("nether");
};
World.prototype.end = function (): Dimension {
  return this.getDimension("end");
};

// Players
World.prototype.findPlayer = function (id) {
  return this.getAllPlayers().find((player) => player.id === id);
};

// Entities
World.prototype.entityCount = function (dimension) {
  return (dimension ?? this.overworld()).getEntities().length;
};

// Ticking Areas
World.prototype.loadArea = async function (location) {
  const id = UUID();

  this.runCommand(
    `tickingarea add circle ${location.x} ${location.y} ${location.z} 4 "${id}"`
  );

  await Sleep(100);

  return id;
};
World.prototype.unloadArea = function (id) {
  this.runCommand(`tickingarea remove "${id}"`);
};

// Blocks
World.prototype.getContainer = function (location, dimension) {
  const block = (dimension ?? this.overworld()).getBlock(location);

  if (!block) {
    return undefined;
  }

  return block.getComponent("inventory")?.container;
};
World.prototype.getContainerItems = function (location, dimension) {
  const container = this.getContainer(location, dimension ?? this.overworld());
  const items: ItemStack[] = [];

  if (!container) {
    return items;
  }

  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);

    if (!item) {
      continue;
    }

    items.push(item);
  }

  return items;
};

// Broadcasting
World.prototype.broadcast = function (message) {
  for (const player of this.getAllPlayers()) {
    player.sendMessage(message);
  }
};
World.prototype.broadcastInfo = function (message) {
  for (const player of this.getAllPlayers()) {
    player.sendInfo(message);
  }
};
World.prototype.broadcastSuccess = function (message) {
  for (const player of this.getAllPlayers()) {
    player.sendSuccess(message);
  }
};
World.prototype.broadcastWarning = function (message) {
  for (const player of this.getAllPlayers()) {
    player.sendWarning(message);
  }
};
World.prototype.broadcastError = function (message) {
  for (const player of this.getAllPlayers()) {
    player.sendError(message);
  }
};
