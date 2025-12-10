import { system, world } from "@minecraft/server";
import ChatRanks from "./modules/chatRanks";
import Combat from "./modules/combat";
import Generators from "./modules/generators";
import LagClear from "./modules/lagClear";
import Moderation from "./modules/moderation";
import Plots from "./modules/plots";
import Protection from "./modules/protection";
import Shops from "./modules/shops";
import StarterKit from "./modules/starterKit";
import Stats from "./modules/stats";
import UI from "./modules/UI";
import { cancelNavigation } from "./utils/Plots/navigation";

world.afterEvents.entitySpawn.subscribe((event) => {
  LagClear.OnSpawn(event);
});
world.afterEvents.playerSpawn.subscribe((event) => {
  Moderation.OnSpawn(event);
  Plots.OnSpawn(event);
  Protection.OnSpawn(event);
  Stats.OnSpawn(event);
  Combat.OnSpawn(event);
});
world.afterEvents.playerLeave.subscribe((event) => {
  Stats.OnLeave(event);
  Plots.OnLeave(event);
  Combat.OnLeave(event);
  cancelNavigation(event.playerId);
});
world.afterEvents.entityHitEntity.subscribe((event) => {
  Shops.OnHit(event);
  Stats.OnHit(event);
  StarterKit.OnHit(event);
  Combat.OnHit(event);
});
world.afterEvents.itemUse.subscribe((event) => {
  UI.OnUse(event);
});
world.afterEvents.entityDie.subscribe((event) => {
  Stats.OnDeath(event);
  Protection.OnDeath(event);
});
world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  StarterKit.OnInteraction(event);
});
world.afterEvents.playerBreakBlock.subscribe((event) => {
  Stats.OnBreak(event);
});
world.afterEvents.entityHurt.subscribe((event) => {
  Stats.OnHurt(event);
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
  Shops.OnInteraction(event);
});
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  Plots.OnBreak(event);
});
world.beforeEvents.playerPlaceBlock.subscribe((event) => {
  Plots.OnPlace(event);
});
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  Plots.OnInteract(event);
  Protection.OnInteraction(event);
});
world.beforeEvents.chatSend.subscribe((event) => {
  ChatRanks.OnChat(event);
});

system.beforeEvents.startup.subscribe((event) => {
  Generators.OnStartup(event);
});
