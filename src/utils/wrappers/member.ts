import {
  Container,
  Dimension,
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  system,
  type Player,
  type Vector3,
  type VectorXZ,
} from "@minecraft/server";
import Config from "../../lib/config";
import type {
  EquipmentItem,
  Health,
  InventoryItem,
  MixedItem,
} from "../../types/wrappers";
import Cache from "../cache";
import Location from "../location";
import Sleep from "../sleep";
import World from "./world";
import { VectorUtils } from "../VectorUtils";

export default class Member {
  public constructor(private readonly player: Player) {}

  public Username(): string {
    return this.player.name;
  }
  public EntityID(): string {
    return this.player.id;
  }
  public Player(): Player {
    return this.player;
  }

  public Health(): Health {
    const health = this.player.getComponent("health");

    if (!health) {
      return { current: 0, max: 0 };
    }

    return {
      current: health.currentValue,
      max: health.defaultValue,
    };
  }

  public Location(): Vector3 {
    return this.player.location;
  }

  public RunCommand(command: string): void {
    this.player.runCommand(command);
  }

  public Disconnect(reason = "N/A"): void {
    this.RunCommand(`kick "${this.Username()}" ${reason}`);
  }

  public AddEffect(
    effect: string,
    duration: number,
    amplifier: number,
    showParticles = false
  ): void {
    this.player.addEffect(effect, duration, {
      amplifier,
      showParticles,
    });
  }

  public async FadeCamera(): Promise<void> {
    this.player.camera.fade({
      fadeColor: { blue: 0, green: 0, red: 0 },
      fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5 },
    });

    await Sleep(10);
  }

  /**
   * Finds the lowest Y that is air and the highest Y that is not air at (x, z).
   * Teleports the player to the first air block above the highest non-air block.
   * Accepts a Vector3 for position.
   */
  public TpToSurface(location: Vector3): void {
    let x: number, y: number, z: number;
    try {
      x = Number((location as any).x);
      y = Number((location as any).y);
      z = Number((location as any).z);
      if ([x, y, z].some((v) => isNaN(v))) throw new Error();
    } catch {
      throw new TypeError("TpToSurface expects a Vector3 with numeric x, y, z");
    }

    let highestSolidY: number | null = null;
    for (let checkY = 0; checkY <= y; checkY++) {
      const block = World.Overworld().getBlock({ x, y: checkY, z });
      if (block && block.typeId !== "minecraft:air") {
        highestSolidY = checkY;
      }
    }
    const targetY = highestSolidY !== null ? highestSolidY + 1 : y;
    let locationcenter = VectorUtils.center(VectorUtils.from({x, y: targetY, z}))
    this.player.teleport(locationcenter);
  }

  public Teleport(location: Vector3): void {
    this.player.teleport(location);
  }
  public async SlowTeleport(
    location: Vector3,
    time: number,
    dimension: Dimension = World.Overworld()
  ): Promise<boolean> {
    const origin = this.Location();
    let cancelled: boolean = false;

    return new Promise<boolean>((resolve) => {
      for (let i = 0; i < time; i++) {
        system.runTimeout(async () => {
          switch (true) {
            case cancelled === true:
              break;

            case !Location.Same(origin, this.Location()):
              this.SendError("You moved!");

              resolve(false);
              cancelled = true;
              break;

            case i === time - 1:
              await this.FadeCamera();

              this.Teleport(location);

              this.AddEffect("resistance", 20 * 3, 255);
              this.AddEffect("weakness", 20 * 3, 255);

              await Sleep(20);

              resolve(true);
              break;

            default:
              this.SendInfo(`Teleporting in ${time - i - 1}...`);

              break;
          }
        }, i * 20);
      }
    });
  }

  public PlaySound(sound: keyof typeof Config.sounds, pitch?: number) {
    this.player.playSound(Config.sounds[sound], {
      pitch,
    });
  }

  public SendMessage(message: string): void {
    this.player.sendMessage(message);
  }
  public SendInfo(message: string): void {
    this.PlaySound("info");
    this.SendMessage(Config.colors.info + message);
  }
  public SendSuccess(message: string): void {
    this.PlaySound("success");
    this.SendMessage(Config.colors.success + message);
  }
  public SendWarning(message: string): void {
    this.PlaySound("warning");
    this.SendMessage(Config.colors.warning + message);
  }
  public SendError(message: string): void {
    this.PlaySound("error");
    this.SendMessage(Config.colors.error + message);
  }

  public Tags(): string[] {
    return this.player.getTags();
  }
  public HasTag(tag: string): boolean {
    return this.player.hasTag(tag);
  }
  public AddTag(tag: string): void {
    this.player.addTag(tag);
  }
  public RemoveTag(tag: string): void {
    this.player.removeTag(tag);
  }

  public Container(): Container {
    return this.player.getComponent("inventory")?.container as Container;
  }
  public Equipment(): EntityEquippableComponent {
    return this.player.getComponent("equippable") as EntityEquippableComponent;
  }

  public InventoryItems(): InventoryItem[] {
    const items: InventoryItem[] = [];
    const container = this.Container();

    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);

      if (!item) {
        continue;
      }

      items.push({ data: item, slot: i });
    }

    return items;
  }
  public EquipmentItems(): EquipmentItem[] {
    const items: EquipmentItem[] = [];
    const equipment = this.Equipment();

    for (const key of Object.keys(EquipmentSlot) as EquipmentSlot[]) {
      const item = equipment.getEquipment(key);

      if (!item) {
        continue;
      }

      items.push({ data: item, slot: key });
    }

    return items;
  }
  public AllItems(): MixedItem[] {
    return [...this.InventoryItems(), ...this.EquipmentItems()];
  }

  public ClearInventory(): void {
    const container = this.Container();
    const items = this.InventoryItems();

    for (const item of items) {
      container.setItem(item.slot);
    }
  }
  public ClearEquipment(): void {
    const equipment = this.Equipment();
    const items = this.EquipmentItems();

    for (const item of items) {
      equipment.setEquipment(item.slot as EquipmentSlot);
    }
  }
  public ClearAll(): void {
    this.ClearInventory();
    this.ClearEquipment();
  }

  public SetInventorySlot(slot: number, item?: ItemStack): void {
    this.Container().setItem(slot, item);
  }
  public SetEquipmentSlot(
    slot: keyof typeof EquipmentSlot,
    item?: ItemStack
  ): void {
    this.Equipment().setEquipment(slot as EquipmentSlot, item);
  }

  public AddInventoryItem(item: ItemStack): void {
    this.Container().addItem(item);
  }

  public FindItem(typeId: string): MixedItem[] {
    return this.AllItems().filter((item) => item.data.typeId === typeId);
  }
  public FindItemAndDelete(typeId: string): void {
    const items = this.FindItem(typeId);

    if (items.length === 0) {
      return;
    }

    const container = this.Container();
    const equipment = this.Equipment();

    for (const item of items) {
      switch (typeof item.slot) {
        case "string":
          equipment.setEquipment(item.slot as EquipmentSlot);
          break;
        case "number":
          container.setItem(item.slot as number);
          break;
      }
    }
  }
  public FindItemAndReplace(typeId: string, replacer?: ItemStack): void {
    const items = this.FindItem(typeId);

    if (items.length === 0) {
      return;
    }

    const container = this.Container();
    const equipment = this.Equipment();

    for (const item of items) {
      switch (typeof item.slot) {
        case "string":
          equipment.setEquipment(item.slot as EquipmentSlot, replacer);
          break;
        case "number":
          container.setItem(item.slot as number, replacer);
          break;
      }
    }
  }

  public EmptyInventorySlots(): number {
    return this.Container().emptySlotsCount;
  }

  public Moved(): Promise<void> {
    const location = this.Location();

    return new Promise((resolve) => {
      const loop = system.runInterval(() => {
        if (!World.FindMember(this.EntityID())) {
          system.clearRun(loop);

          resolve();
          return;
        }

        const current = this.Location();

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
  }

  public Sidebar(data: string[]): void {
    this.player.onScreenDisplay.setTitle(data.join("\n"));
  }
  public ActionBar(data: string[]): void {
    this.player.onScreenDisplay.setActionBar(data.join("\n"));
  }

  public GetCPS(): number {
    const CPS = (Cache.CPS[this.EntityID()] ?? []).filter(
      (entry) => entry > Date.now() - 1000
    );

    return CPS.length;
  }
  public AddCPS(): void {
    const CPS = (Cache.CPS[this.EntityID()] ?? []).filter(
      (entry) => entry > Date.now() - 1000
    );

    CPS.push(Date.now());

    Cache.CPS[this.EntityID()] = CPS;
  }

  public GetReach(): string {
    return (Cache.Reach[this.EntityID()] ?? 0).toFixed(2);
  }
  public SetReach(target: VectorXZ): void {
    const reach = Math.sqrt(
      Math.pow(this.Location().x - target.x, 2) +
        Math.pow(this.Location().z - target.z, 2)
    );

    Cache.Reach[this.EntityID()] = reach;
  }
  public GetCombo(): number {
    return Cache.Combo[this.EntityID()] ?? 0;
  }
  public AddCombo(): void {
    const combo = (Cache.Combo[this.EntityID()] ?? 0) + 1;

    Cache.Combo[this.EntityID()] = combo;
  }
}
