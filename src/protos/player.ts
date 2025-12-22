import { EquipmentSlot, Player, system, world } from "@minecraft/server";
import { CommonSounds } from "../types/global";
import type {
  EquipmentItem,
  Health,
  InventoryItem,
  MixedItem,
} from "../types/protos";
import Cache from "../utils/cache";
import Sleep from "../utils/sleep";
import { VectorUtils } from "../utils/VectorUtils";

declare module "@minecraft/server" {
  interface Player {
    // General
    health(): Health;
    disconnect(reason?: string): void;
    fadeCamera(): Promise<void>;
    moved(): Promise<void>;

    // Plot Utils
    tpToSurface(location: Vector3): void;

    // Messaging
    sendInfo(message: string): void;
    sendSuccess(message: string): void;
    sendWarning(message: string): void;
    sendError(message: string): void;

    // Inventory
    container(): Container;
    inventoryItems(): InventoryItem[];
    clearInventory(): void;
    setInventoryItem(slot: number, item?: ItemStack): void;
    addInventoryItem(item: ItemStack): void;
    emptyInventorySlots(): number;

    // Equipment
    equipment(): EntityEquippableComponent;
    equipmentItems(): EquipmentItem[];
    clearEquipment(): void;
    setEquipmentItem(slot: keyof typeof EquipmentSlot, item?: ItemStack): void;

    // Both
    allItems(): MixedItem[];
    clear(): void;
    findItem(typeId: string): MixedItem[];
    findItemAndDelete(typeId: string): void;
    findItemAndReplace(typeId: string, replacer?: ItemStack): void;

    // CPS
    getCPS(): number;
    addCPS(): void;

    // Reach
    getReach(): string;
    setReach(target: VectorXZ): void;

    // Combo
    getCombo(): number;
    addCombo(): void;
  }
}

// General
Player.prototype.health = function () {
  const health = this.getComponent("health")!;

  return {
    current: health.currentValue,
    max: health.defaultValue,
  };
};
Player.prototype.disconnect = function (reason) {
  this.runCommand(`kick ${this.name}" ${reason}`);
};
Player.prototype.fadeCamera = async function () {
  this.camera.fade({
    fadeColor: { blue: 0, green: 0, red: 0 },
    fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5 },
  });

  await Sleep(10);
};
Player.prototype.moved = async function () {
  const location = this.location;

  return new Promise((resolve) => {
    const loop = system.runInterval(() => {
      if (!world.findPlayer(this.id)) {
        system.clearRun(loop);

        resolve();
        return;
      }

      const current = this.location;

      if (
        current.x.toFixed() === location.x.toFixed() &&
        current.z.toFixed() === location.z.toFixed()
      ) {
        return;
      }

      system.clearRun(loop);

      resolve();
    });
  });
};

// Plot Utils
Player.prototype.tpToSurface = function (location) {
  let { x, y, z } = location;
  let highestSolidY: number | null = null;

  for (let checkY = 0; checkY <= y; checkY++) {
    const block = world.overworld().getBlock({ x, y: checkY, z });

    if (block && block.typeId !== "minecraft:air") {
      highestSolidY = checkY;
    }
  }

  const targetY = highestSolidY !== null ? highestSolidY + 1 : y;
  let locationcenter = VectorUtils.center(
    VectorUtils.from({ x, y: targetY, z })
  );

  this.teleport(locationcenter);
};

// Messaging
Player.prototype.sendInfo = function (message) {
  this.playSound(CommonSounds.INFO);
  this.sendMessage(message);
};
Player.prototype.sendSuccess = function (message) {
  this.playSound(CommonSounds.SUCCESS);
  this.sendMessage("§a" + message);
};
Player.prototype.sendWarning = function (message) {
  this.playSound(CommonSounds.WARNING);
  this.sendMessage("§e" + message);
};
Player.prototype.sendError = function (message) {
  this.playSound(CommonSounds.ERROR);
  this.sendMessage("§c" + message);
};

// Inventory
Player.prototype.container = function () {
  return this.getComponent("inventory")!.container;
};
Player.prototype.inventoryItems = function () {
  const items: InventoryItem[] = [];
  const container = this.container();

  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);

    if (!item) {
      continue;
    }

    items.push({ data: item, slot: i });
  }

  return items;
};
Player.prototype.clearInventory = function () {
  const container = this.container();
  const items = this.inventoryItems();

  for (const item of items) {
    container.setItem(item.slot);
  }
};
Player.prototype.setInventoryItem = function (slot, item) {
  this.container().setItem(slot, item);
};
Player.prototype.addInventoryItem = function (item) {
  this.container().addItem(item);
};
Player.prototype.emptyInventorySlots = function () {
  return this.container().emptySlotsCount;
};

// Equipment
Player.prototype.equipment = function () {
  return this.getComponent("equippable")!;
};
Player.prototype.equipmentItems = function () {
  const items: EquipmentItem[] = [];
  const equipment = this.equipment();

  for (const key of Object.keys(EquipmentSlot) as EquipmentSlot[]) {
    const item = equipment.getEquipment(key);

    if (!item) {
      continue;
    }

    items.push({ data: item, slot: key });
  }

  return items;
};
Player.prototype.clearEquipment = function () {
  const equipment = this.equipment();
  const items = this.equipmentItems();

  for (const item of items) {
    equipment.setEquipment(item.slot as EquipmentSlot);
  }
};
Player.prototype.setEquipmentItem = function (slot, item) {
  this.equipment().setEquipment(slot as EquipmentSlot, item);
};

// Both
Player.prototype.allItems = function () {
  return [...this.inventoryItems(), ...this.equipmentItems()];
};
Player.prototype.clear = function () {
  this.clearInventory();
  this.clearEquipment();
};
Player.prototype.findItem = function (typeId) {
  return this.allItems().filter((item) => item.data.typeId === typeId);
};
Player.prototype.findItemAndDelete = function (typeId) {
  const items = this.findItem(typeId);

  if (items.length === 0) {
    return;
  }

  for (const item of items) {
    switch (typeof item.slot) {
      case "string":
        this.equipment().setEquipment(item.slot as EquipmentSlot);
        break;
      case "number":
        this.container().setItem(item.slot as number);
        break;
    }
  }
};
Player.prototype.findItemAndReplace = function (typeId, replacer) {
  const items = this.findItem(typeId);

  if (items.length === 0) {
    return;
  }

  for (const item of items) {
    switch (typeof item.slot) {
      case "string":
        this.equipment().setEquipment(item.slot as EquipmentSlot, replacer);
        break;
      case "number":
        this.container().setItem(item.slot as number, replacer);
        break;
    }
  }
};

// CPS
Player.prototype.getCPS = function () {
  Cache.CPS[this.id] = (Cache.CPS[this.id] ?? []).filter(
    (entry) => entry > Date.now() - 1000
  );

  return Cache.CPS[this.id]!.length;
};
Player.prototype.addCPS = function () {
  const CPS = (Cache.CPS[this.id] ?? []).filter(
    (entry) => entry > Date.now() - 1000
  );

  CPS.push(Date.now());

  Cache.CPS[this.id] = CPS;
};

// Reach
Player.prototype.getReach = function () {
  return (Cache.Reach[this.id] ?? 0).toFixed(2);
};
Player.prototype.setReach = function (target) {
  const reach = Math.sqrt(
    Math.pow(this.location.x - target.x, 2) +
      Math.pow(this.location.z - target.z, 2)
  );

  Cache.Reach[this.id] = reach;
};

// Combo
Player.prototype.getCombo = function () {
  return Cache.Combo[this.id] ?? 0;
};
Player.prototype.addCombo = function () {
  Cache.Combo[this.id] = (Cache.Combo[this.id] ?? 0) + 1;
};
