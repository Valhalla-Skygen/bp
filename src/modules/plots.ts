import {
  Block,
  BlockVolume,
  Player,
  PlayerBreakBlockBeforeEvent,
  PlayerInteractWithBlockBeforeEvent,
  PlayerLeaveAfterEvent,
  PlayerPlaceBlockBeforeEvent,
  PlayerSpawnAfterEvent,
  StructureAnimationMode,
  StructureRotation,
  StructureSaveMode,
  system,
  world,
  type Vector3,
} from "@minecraft/server";
import Config from "../lib/config";
import type { ActionFormButton } from "../types/form";
import { CommonSounds } from "../types/global";
import {
  PlotRanks,
  type Plot,
  type PlotMember,
  type PlotSlot,
} from "../types/plots";
import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Formatter from "../utils/formatter";
import Item from "../utils/item";
import Location from "../utils/location";
import Logger from "../utils/logger";
import {
  cancelNavigation,
  isNavigating,
  startNavigationToPlot,
} from "../utils/Plots/navigation";
import Sleep from "../utils/sleep";
import TargetFinder from "../utils/targetFinder";
import StarterKit from "./starterKit";

export default class Plots {
  private static AllowPlayers: boolean = true;
  public static Raidnight: boolean;

  public static async Init(): Promise<void> {
    Plots.EjectProtection();

    await this.PlotRecovery();
    await this.OptimizePlots();

    this.UpdateRaidnight();
    this.UpdatePlotTags();
  }

  public static async OnSpawn(event: PlayerSpawnAfterEvent): Promise<void> {
    const { player, initialSpawn } = event;

    if (!initialSpawn) {
      return;
    }
    if (!Plots.AllowPlayers) {
      player.disconnect(
        "Plots are currently being unloaded. You are not allowed to be in the server during this process to protect against progress loss."
      );
    }
  }
  public static async OnLeave(event: PlayerLeaveAfterEvent): Promise<void> {
    const { playerId: entity_id } = event;
    const plotMember = await API.Plots.Member(entity_id);

    if (!plotMember.data) {
      return;
    }

    const plot = await API.Plots.Plot(plotMember.data.plot_id);
    const members = await API.Plots.PlotMembers(plotMember.data.plot_id);

    if (!plot.data || !plot.data.slot || !members.data) {
      return;
    }

    if (
      world
        .getAllPlayers()
        .filter((entry) =>
          (members.data as PlotMember[]).some(
            (member) => member.entity_id === entry.id
          )
        ).length > 0
    ) {
      return;
    }

    const slot = Config.plot_slots.find(
      (entry) => entry.slot === (plot.data as Plot).slot
    );
    const defaultPlot = world.structureManager.get(
      Config.plot_default_structure
    );

    if (!slot || !defaultPlot) {
      return;
    }

    const tickingID = await world.loadArea(slot.saveZone[0]);

    Plots.SavePlot(plot.data._id, slot);

    await Sleep(5);

    await API.Plots.UpdatePlot(plot.data._id, { slot: 0 });

    world.structureManager.place(
      defaultPlot,
      world.overworld(),
      slot.saveZone[0],
      {
        animationMode: StructureAnimationMode.Layers,
        animationSeconds: 5,
        includeEntities: false,
      }
    );

    await Sleep(20 * 5);

    world.unloadArea(tickingID);
  }
  public static async OnBreak(
    event: PlayerBreakBlockBeforeEvent
  ): Promise<void> {
    const { block, player } = event;
    const plotMember = Cache.PlotMembers.find(
      (entry) => entry.entity_id === player.id
    );

    for (const slot of Config.plot_slots) {
      if (!Location.Inside(slot.saveZone, block.location)) {
        continue;
      }

      const plot = Cache.Plots.find((plot) => plot.slot === slot.slot);

      if (!plot) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(`Claim this plot to break blocks here!`);
        continue;
      }
      if (this.Raidnight) {
        continue;
      }
      if (
        !plotMember ||
        plotMember.plot_id !== plot._id ||
        !plotMember.permissions.break
      ) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(`You are not allowed to break blocks in this plot!`);
        continue;
      }
    }
  }
  public static async OnPlace(
    event: PlayerPlaceBlockBeforeEvent
  ): Promise<void> {
    const { block, player, permutationToPlace } = event;
    const plotMember = Cache.PlotMembers.find(
      (entry) => entry.entity_id === player.id
    );

    for (const slot of Config.plot_slots) {
      if (!Location.Inside(slot.saveZone, block.location)) {
        continue;
      }

      const plot = Object.values(Cache.Plots).find(
        (plot) => plot.slot === slot.slot
      );

      if (!plot) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(`Claim this plot to place blocks here!`);
        continue;
      }
      if (
        Object.keys(Config.generators).includes(permutationToPlace.type.id) &&
        (!plotMember ||
          plotMember.plot_id !== plot._id ||
          !plotMember.permissions.build)
      ) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(`You cannot place generators here!`);
        continue;
      }
      if (this.Raidnight) {
        continue;
      }
      if (
        !plotMember ||
        plotMember.plot_id !== plot._id ||
        !plotMember.permissions.build
      ) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(`You are not allowed to place blocks in this plot!`);
        continue;
      }
    }
  }
  public static async OnInteract(
    event: PlayerInteractWithBlockBeforeEvent
  ): Promise<void> {
    const { block, player } = event;

    if (
      !block.getComponent("inventory")?.container &&
      !Object.keys(Config.generators).includes(block.typeId)
    ) {
      return;
    }

    const plotMember = Cache.PlotMembers.find(
      (entry) => entry.entity_id === player.id
    );

    for (const slot of Config.plot_slots) {
      if (!Location.Inside(slot.saveZone, block.location)) {
        continue;
      }

      const plot = Object.values(Cache.Plots).find(
        (plot) => plot.slot === slot.slot
      );

      if (!plot) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(`Claim this plot to interact with containers here!`);
        continue;
      }
      if (
        Object.keys(Config.generators).includes(block.typeId) &&
        plotMember?.permissions.pickup &&
        plotMember.plot_id === plot._id
      ) {
        system.run(() => this.PickupPage(player, block));
        return;
      }
      if (!block.getComponent("inventory")?.container) {
        return;
      }
      if (this.Raidnight) {
        return;
      }
      if (
        !plotMember ||
        plotMember.plot_id !== plot._id ||
        !plotMember.permissions.containers
      ) {
        event.cancel = true;

        await Sleep(0);

        player.sendError(
          `You are not allowed to interact with containers in this plot!`
        );
        return;
      }
    }
  }

  public static async Redirector(player: Player): Promise<void> {
    const plotMember = await API.Plots.Member(player.id);

    if (!plotMember.data) {
      this.InitPage(player);
      return;
    }

    switch (plotMember.data.rank) {
      case PlotRanks.MEMBER:
        this.MemberPage(player, plotMember.data);
        return;
      case PlotRanks.OWNER:
        this.OwnerPage(player, plotMember.data);
        return;
    }
  }

  public static async OwnerPage(
    player: Player,
    plotMember: PlotMember
  ): Promise<void> {
    const plot = await API.Plots.Plot(plotMember.plot_id);

    if (!plot.data) {
      player.sendError("Could not find your plot!");
      return;
    }

    const slot = Config.plot_slots.find(
      (entry) => entry.slot === (plot.data as Plot).slot
    );
    const plotMembers = await API.Plots.PlotMembers(plotMember.plot_id);

    if (!plotMembers.data) {
      player.sendError("Could not find your plot members!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cPlot Management",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nMembers: §a${
        plotMembers.data.length
      }§7/§c${Config.plot_max_members}\n§7Located at: ${
        !plot.data.slot ? "§cNot Loaded!" : `§aPlot ${plot.data.slot}`
      }\n\n`,
      buttons: [
        {
          text: plot.data.slot ? "Unload Plot" : "Load Plot",
          subtext: "Click to Open",
          icon: "textures/ui/world_glyph_color_2x",
        },
        {
          text: "Warp to Plot",
          subtext: "Click to Open",
          icon: "textures/items/ender_pearl",
        },
        {
          text: isNavigating(player.id)
            ? "Stop Navigating"
            : "Navigate to Plot",
          subtext: isNavigating(player.id) ? "End Navigation" : "Click to Open",
          icon: "textures/ui/icon_map",
        },
        {
          text: "Manage Members",
          subtext: "Click to Open",
          icon: "textures/ui/icon_multiplayer",
        },
        {
          text: "Plot Invites",
          subtext: "Click to Open",
          icon: "textures/ui/mail_icon",
        },
        {
          text: "Terminate Plot",
          subtext: "Click to Open",
          icon: "textures/blocks/tnt_side",
        },
      ],
    });

    switch (form.selection) {
      case 0:
        plot.data.slot
          ? this.UnloadPlotConfirmation(player, plot.data)
          : this.LoadPlot(player, plot.data);
        return;
      case 1:
        this.Teleport(player, slot);
        return;
      case 2:
        // if isNavigating do cancel
        if (isNavigating(player.id)) {
          cancelNavigation(player.id);
          return;
        }
        this.NavigateToPlot(player);
        return;
      case 3:
        this.MemberManagementPage(player);
        return;
      case 4:
        this.InviteManagerPage(player);
        return;
      case 5:
        this.TerminatePlotPage(player);
        return;
    }
  }
  public static async MemberPage(
    player: Player,
    plotMember: PlotMember
  ): Promise<void> {
    const plot = await API.Plots.Plot(plotMember.plot_id);

    if (!plot.data) {
      player.sendError("Could not find your plot!");
      return;
    }

    const plotMembers = await API.Plots.PlotMembers(plotMember.plot_id);

    if (!plotMembers.data) {
      player.sendError("Could not find your plot members!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cPlot Management",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nMembers: §a${
        plotMembers.data.length
      }§7/§c${Config.plot_max_members}\n§7Located at: ${
        !plot.data.slot ? "§cNot Loaded!" : `§aPlot ${plot.data.slot}`
      }\n\n`,
      buttons: [
        {
          text: plot.data.slot ? "Unload Plot" : "Load Plot",
          subtext: "Click to Open",
          icon: "textures/ui/world_glyph_color_2x",
        },
        {
          text: "Warp to Plot",
          subtext: "Click to Open",
          icon: "textures/items/ender_pearl",
        },
        {
          text: isNavigating(player.id)
            ? "Stop Navigating"
            : "Navigate to Plot",
          subtext: isNavigating(player.id) ? "End Navigation" : "Click to Open",
          icon: "textures/ui/icon_map",
        },
        {
          text: "Plot Invites",
          subtext: "Click to Open",
          icon: "textures/ui/mail_icon",
        },
        {
          text: "Leave Plot",
          subtext: "Click to Open",
          icon: "textures/items/door_wood",
        },
      ],
    });

    const slot = Config.plot_slots.find(
      (entry) => entry.slot === (plot.data as Plot).slot
    );

    switch (form.selection) {
      case 0:
        if (!plotMember.permissions.loading) {
          player.sendError("You do not have permission to load/unload a plot!");
          return;
        }

        plot.data.slot
          ? this.UnloadPlot(player, plot.data)
          : this.LoadPlot(player, plot.data);
        return;
      case 1:
        this.Teleport(player, slot);
        return;
      case 2:
        // if isNavigating do Cancel
        if (isNavigating(player.id)) {
          cancelNavigation(player.id);
          return;
        }
        this.NavigateToPlot(player);
        return;
      case 3:
        this.InviteManagerPage(player);
        return;
      case 4:
        this.LeavePlot(player, plotMember);
        return;
    }
  }

  public static async LeavePlot(
    player: Player,
    plotMember: PlotMember
  ): Promise<void> {
    await API.Plots.DeleteMember(player.id);

    const members = await API.Plots.PlotMembers(plotMember.plot_id);
    const username = player.name;
    let online = 0;

    if (!members.data) {
      Logger.Error("Failed to get plot members.");
      return;
    }

    for (const memberData of members.data) {
      const member = world.findPlayer(memberData.entity_id);

      if (!member) {
        continue;
      }

      member.sendWarning(`§c${username}§e has left the plot!`);
      online++;
    }

    player.sendSuccess("You have left the plot!");

    if (online !== 0) {
      return;
    }

    const plot = await API.Plots.Plot(plotMember.plot_id);

    if (!plot.data || !plot.data.slot) {
      return;
    }

    const slot = Config.plot_slots.find(
      (entry) => entry.slot === (plot.data as Plot).slot
    );

    if (!slot) {
      return;
    }

    const tickingID = await world.loadArea(slot.saveZone[0]);
    const defaultPlot = world.structureManager.get(
      Config.plot_default_structure
    );

    this.SavePlot(plotMember.plot_id, slot);

    await Sleep(0);

    if (!defaultPlot) {
      world.unloadArea(tickingID);
      return;
    }

    world.structureManager.place(
      defaultPlot,
      world.overworld(),
      slot.saveZone[0],
      {
        animationMode: StructureAnimationMode.Layers,
        animationSeconds: 5,
        includeEntities: false,
      }
    );

    await Sleep(20 * 5);

    world.unloadArea(tickingID);
  }

  public static async LoadPlot(player: Player, plot: Plot): Promise<void> {
    if (Cache.CombatTime[player.id]) {
      player.sendError("You cannot unload your plot while in combat!");
      return;
    }

    const plotCooldown = Cache.PlotLoadCooldown[plot._id];

    if (
      plotCooldown &&
      plotCooldown > new Date(Date.now() - Config.plot_loading_cooldown * 1000)
    ) {
      player.sendError(
        "Please wait before attempting to load/unload your plot again!"
      );
      return;
    }

    Cache.PlotLoadCooldown[plot._id] = new Date();

    const activePlots = await API.Plots.ActivePlots();

    if (!activePlots.data) {
      player.sendError("Could not find active plots!");
      return;
    }

    const slots = Config.plot_slots.filter(
      (entry) =>
        !(activePlots.data as Plot[]).some((plot) => plot.slot === entry.slot)
    );

    if (slots.length === 0) {
      player.sendError("There are no available plots!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cLoad Plot",
      body: `§7Hello, §c§l${player.name}§r§7!\n\nPlease select a plot below!\n\n`,
      buttons: slots.map((slot) => {
        return {
          text: `§cPlot ${slot.slot}`,
          subtext: "Click to Load",
          icon: "textures/blocks/redstone_lamp_off",
        };
      }),
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    const slot = slots[form.selection];

    if (!slot) {
      player.sendError("Could not find that slot!");
      return;
    }

    if (await this.SlotTaken(slot.slot)) {
      player.sendError("That plot is already taken!");
      return;
    }

    const structure = world.structureManager.get(`plot:${plot._id}`);

    if (!structure) {
      player.sendError(
        "It seems your plot structure is missing! Please contact support!"
      );
      return;
    }

    await API.Plots.UpdatePlot(plot._id, {
      slot: slot.slot,
      rotation: slot.rotation,
    });

    const warp = slot.locations[
      Math.floor(Math.random() * slot.locations.length)
    ] as Vector3;

    for (const zone of Config.zones) {
      player.removeTag(zone.tag);
    }

    player.sendMessage(`§7Loading plot...`);

    await player.fadeCamera();

    player.tpToSurface(warp);

    await Sleep(20);

    player.addTag("plots");

    world.structureManager.place(
      structure,
      world.overworld(),
      slot.saveZone[0],
      {
        animationMode: StructureAnimationMode.Layers,
        animationSeconds: 5,
        rotation: this.GetRotation(plot.rotation, slot.rotation),
        includeEntities: false,
      }
    );

    await Sleep(20 * 5);

    const members = await API.Plots.PlotMembers(plot._id);

    if (!members.data) {
      Logger.Error("Failed to get plot members.");
      return;
    }

    for (const memberData of members.data) {
      const member = world.findPlayer(memberData.entity_id);

      if (!member) {
        continue;
      }

      member.sendSuccess(`Your plot has been loaded at slot ${slot.slot}!`);
    }
  }
  public static async UnloadPlot(player: Player, plot: Plot): Promise<void> {
    if (Cache.CombatTime[player.id]) {
      player.sendError("You cannot unload your plot while in combat!");
      return;
    }

    const plotCooldown = Cache.PlotLoadCooldown[plot._id];

    if (
      plotCooldown &&
      plotCooldown > new Date(Date.now() - Config.plot_loading_cooldown * 1000)
    ) {
      player.sendError(
        "Please wait before attempting to load/unload your plot again!"
      );
      return;
    }

    Cache.PlotLoadCooldown[plot._id] = new Date();

    const slot = Config.plot_slots.find((entry) => entry.slot === plot.slot);

    if (!slot) {
      player.sendError("Could not find your plot slot!");
      return;
    }

    const warp = slot.locations[
      Math.floor(Math.random() * slot.locations.length)
    ] as Vector3;

    for (const zone of Config.zones) {
      player.removeTag(zone.tag);
    }

    player.sendMessage(`§7Loading plot area...`);

    const tickingID = await world.loadArea(slot.saveZone[0]);

    player.sendMessage(`§7Unloading plot...`);

    await player.fadeCamera();

    player.tpToSurface(warp);

    await Sleep(20);

    player.addTag("plots");

    this.SavePlot(plot._id, slot);

    await API.Plots.UpdatePlot(plot._id, {
      slot: 0,
    });

    world.structureManager.place(
      Config.plot_default_structure,
      world.overworld(),
      slot.saveZone[0],
      {
        animationMode: StructureAnimationMode.Layers,
        animationSeconds: 5,
        includeEntities: false,
      }
    );

    await Sleep(20 * 5);

    const members = await API.Plots.PlotMembers(plot._id);

    if (!members.data) {
      Logger.Error("Failed to get plot members.");
      return;
    }

    for (const memberData of members.data) {
      const member = world.findPlayer(memberData.entity_id);

      if (!member) {
        continue;
      }

      member.sendWarning(`Your plot has been unloaded!`);
    }

    world.unloadArea(tickingID);
  }

  public static async UnloadPlotConfirmation(
    player: Player,
    plot: Plot
  ): Promise<void> {
    if (Cache.CombatTime[player.id]) {
      player.sendError("You cannot unload your plot while in combat!");
      return;
    }

    // Confirmation form before unloading
    const confirm = await Form.ActionForm({
      player: player,
      title: "§cUnload Plot",
      body: "Are you sure you want to unload your plot?\n\nThis will remove your plot from the world until you load it again.",
      buttons: [
        {
          text: "Unload Plot",
          subtext: "Click to Unload",
          icon: "textures/ui/check",
        },
        {
          text: "Cancel",
          subtext: "Click to Cancel",
          icon: "textures/ui/cancel",
        },
      ],
    });

    if (confirm.selection !== 0) {
      player.sendWarning("Plot unload cancelled.");
      return;
    }

    const plotCooldown = Cache.PlotLoadCooldown[plot._id];

    if (
      plotCooldown &&
      plotCooldown > new Date(Date.now() - Config.plot_loading_cooldown * 1000)
    ) {
      player.sendError(
        "Please wait before attempting to load/unload your plot again!"
      );
      return;
    }

    Cache.PlotLoadCooldown[plot._id] = new Date();

    const slot = Config.plot_slots.find((entry) => entry.slot === plot.slot);

    if (!slot) {
      player.sendError("Could not find your plot slot!");
      return;
    }

    const warp = slot.locations[
      Math.floor(Math.random() * slot.locations.length)
    ] as Vector3;

    for (const zone of Config.zones) {
      player.removeTag(zone.tag);
    }

    player.sendMessage(`§7Loading plot area...`);

    const tickingID = await world.loadArea(slot.saveZone[0]);

    player.sendMessage(`§7Unloading plot...`);

    await player.fadeCamera();

    player.tpToSurface(warp);

    await Sleep(20);

    player.addTag("plots");

    this.SavePlot(plot._id, slot);

    await API.Plots.UpdatePlot(plot._id, {
      slot: 0,
    });

    world.structureManager.place(
      Config.plot_default_structure,
      world.overworld(),
      slot.saveZone[0],
      {
        animationMode: StructureAnimationMode.Layers,
        animationSeconds: 5,
        includeEntities: false,
      }
    );

    await Sleep(20 * 5);

    const members = await API.Plots.PlotMembers(plot._id);

    if (!members.data) {
      Logger.Error("Failed to get plot members.");
      return;
    }

    for (const memberData of members.data) {
      const member = world.findPlayer(memberData.entity_id);

      if (!member) {
        continue;
      }

      member.sendWarning(`Your plot has been unloaded!`);
    }

    world.unloadArea(tickingID);
  }

  public static async TerminatePlotPage(player: Player): Promise<void> {
    const plotMember = await API.Plots.Member(player.id);

    if (!plotMember.data) {
      player.sendError("Could not find your plot!");
      return;
    }

    const plot = await API.Plots.Plot(plotMember.data.plot_id);

    if (!plot) {
      player.sendError("Could not find your plot!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cTerminate Plot",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nAre you sure you want to terminate your plot? You cannot undo this action, and this will dismember everyone in your plot!\n\n`,
      buttons: [
        {
          text: "Terminate Plot",
          subtext: "Click to Open",
          icon: "textures/blocks/glass_green",
        },
        {
          text: "Cancel",
          subtext: "Click to Open",
          icon: "textures/blocks/glass_red",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        player.sendError("Form closed.");
        return;
      case 0:
        const members = await API.Plots.PlotMembers(plotMember.data.plot_id);

        if (!members.data) {
          player.sendError("Could not find your plot members!");
          return;
        }

        await API.Plots.DeletePlot(plotMember.data.plot_id);
        world.structureManager.delete(`plot:${plotMember.data.plot_id}`);

        for (const plotMember of members.data) {
          const member = world.findPlayer(plotMember.entity_id);

          if (!member) {
            continue;
          }

          member.sendWarning("Your plot has been terminated!");
        }

        const defaultPlot = world.structureManager.get(
          Config.plot_default_structure
        );
        const slot = Config.plot_slots.find(
          (entry) => entry.slot === (plot.data as Plot).slot
        );

        if (!defaultPlot || !slot) {
          return;
        }

        world.structureManager.place(
          defaultPlot,
          world.overworld(),
          slot.saveZone[0],
          {
            animationMode: StructureAnimationMode.Layers,
            animationSeconds: 5,
            includeEntities: false,
          }
        );
        return;
      case 1:
        player.sendWarning("Plot termination cancelled!");
        return;
    }
  }

  public static async InviteManagerPage(player: Player): Promise<void> {
    const plotMember = await API.Plots.Member(player.id);

    if (!plotMember.data) {
      player.sendError("Could not find your plot!");
      return;
    }
    if (
      plotMember.data.rank !== PlotRanks.OWNER &&
      !plotMember.data.permissions.inviting
    ) {
      player.sendError("You do not have permission to invite members!");
      return;
    }

    const invites = await API.Plots.PlotInvites(plotMember.data.plot_id);

    if (!invites.data) {
      player.sendError("Could not find your plot invites!");
      return;
    }

    const displayedInvites = invites.data.map(async (invite) => {
      const profile = await API.Profiles.Profile(invite.target);

      if (!profile.data) {
        return {
          text: "Unknown Profile",
          subtext: "Click to Delete",
          icon: "textures/ui/mail_icon",
        } as ActionFormButton;
      }

      return {
        text: profile.data.username,
        subtext: "Click to Delete",
        icon: "textures/ui/mail_icon",
      } as ActionFormButton;
    });
    const form = await Form.ActionForm({
      player: player,
      title: "§cInvite Manager",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nPlease select an invite below to delete it, or select "Send Invite" to invite a new member!\n\n`,
      buttons: [
        {
          text: "Send Invite",
          subtext: "Click to Open",
          icon: "textures/ui/color_plus",
        },
        ...(await Promise.all(displayedInvites)),
      ],
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }
    if (form.selection === 0) {
      this.InviteMember(player, plotMember.data.plot_id);
      return;
    }

    const invite = invites.data[form.selection - 1];

    if (!invite) {
      player.sendError("Could not find invite!");
      return;
    }

    await API.Plots.DeleteInvite(plotMember.data.plot_id, invite._id);

    player.sendSuccess("Successfully deleted invite!");
  }
  public static async InviteMember(
    player: Player,
    plot_id: string
  ): Promise<void> {
    const targetData = await TargetFinder.OfflineSearch(player);

    if (!targetData) {
      return;
    }

    const request = await API.Plots.Invite(plot_id, {
      plot_id,
      sender: player.id,
      target: targetData.entity_id,
    });
    const target = world.findPlayer(targetData.entity_id);

    switch (request.status) {
      case 200:
        player.sendSuccess(
          `Successfully invited ${targetData.username} to your plot!`
        );

        if (target) {
          target.sendSuccess(
            `You have been invited to join ${player.name}'s plot!`
          );
        }

        return;
      case 400:
        player.sendError("Error while sending invite!");
        return;
      case 404:
        player.sendError("Could not find your target!");
        return;
      case 409:
        player.sendError(
          `${targetData.username} is already in a plot, or you have already invited them!`
        );
        return;
    }
  }

  public static async Teleport(
    player: Player,
    slot: PlotSlot | undefined
  ): Promise<void> {
    if (!slot) {
      player.sendError("Your plot is not loaded!");
      return;
    }

    const warp = slot.locations[
      Math.floor(Math.random() * slot.locations.length)
    ] as Vector3;

    const currentTag = Config.zones.find((entry) => player.hasTag(entry.tag));

    for (const entry of Config.zones) {
      player.removeTag(entry.tag);
    }

    if (Cache.CombatTime[player.id]) {
      player.sendError("You cannot teleport while in combat!");

      if (currentTag) {
        player.addTag(currentTag.tag);
      }

      return;
    } else {
      await player.fadeCamera();

      player.tpToSurface(warp);

      player.addEffect("resistance", 20 * 3, {
        amplifier: 255,
        showParticles: false,
      });
      player.addEffect("weakness", 20 * 3, {
        amplifier: 255,
        showParticles: false,
      });

      await Sleep(20);
    }

    player.addTag("plots");
    player.sendSuccess("Successfully teleported you to your plot!");

    StarterKit.Give(player, true);
  }

  public static async NavigateToPlot(player: Player): Promise<void> {
    const plotMember = await API.Plots.Member(player.id);

    if (!plotMember.data) {
      player.sendError("Could not find your plot member data!");
      return;
    }

    const plots = Config.plot_slots;

    if (plots.length === 0) {
      player.sendError("There are no loaded plots to navigate to!");
      return;
    }

    // Sort by slot number for a clean list
    plots.sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0));

    // Check if currently navigating
    const currentlyNavigating = isNavigating(player.id);

    const form = await Form.ActionForm({
      player: player,
      title: "§cNavigate to Plot",
      body: `§7Hello, §c§l${player.name}§r§7!\n\nPlease select a plot below to navigate to!\n\n`,
      buttons: [
        ...plots.map((plot) => ({
          text: `§cPlot ${plot.slot}`,
          subtext: "Click to Navigate",
          icon: "textures/ui/icon_map",
        })),
      ],
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    if (form.selection === 0 && currentlyNavigating) {
      cancelNavigation(player.id);
      player.sendSuccess("Navigation cancelled.");
      return;
    }

    // Adjust index for plot selection
    const selectedPlot = plots[form.selection];

    if (!selectedPlot || !selectedPlot.slot) {
      player.sendError("Could not find that plot!");
      return;
    }

    try {
      startNavigationToPlot(player, selectedPlot.slot);
    } catch (e) {
      Logger.Error(
        `Failed to start navigation: ${String(e)}`,
        JSON.stringify(selectedPlot, null, 2)
      );
      player.sendError("Failed to start navigation to that plot!");
    }
  }

  public static async MemberManagementPage(player: Player): Promise<void> {
    const plotMember = await API.Plots.Member(player.id);

    if (!plotMember.data) {
      player.sendError("Could not find your plot member data!");
      return;
    }
    if (plotMember.data.rank !== PlotRanks.OWNER) {
      player.sendError("You do not have permission to manage members!");
      return;
    }

    const members = await API.Plots.PlotMembers(plotMember.data.plot_id);

    if (!members.data) {
      player.sendError("Could not find your plot members!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cMember Manager",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nPlease select a member below to manage them!\n\n`,
      buttons: await Promise.all(
        members.data.map(async (member) => {
          const profile = await API.Profiles.Profile(member.entity_id);

          if (!profile.data) {
            return {
              text: "Unknown Profile",
              subtext: "Click to Manage",
              icon: "textures/ui/icon_steve",
            };
          }

          return {
            text: profile.data.username,
            subtext: "Click to Manage",
            icon: "textures/ui/icon_steve",
          };
        })
      ),
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    const target = members.data[form.selection];

    if (!target) {
      player.sendError("Could not find member!");
      return;
    }

    this.ManageMemberPage(player, target);
  }
  public static async ManageMemberPage(
    player: Player,
    target: PlotMember
  ): Promise<void> {
    if (target.rank === PlotRanks.OWNER) {
      player.sendError("You cannot manage the owner of your plot!");
      return;
    }

    const targetData = await API.Profiles.Profile(target.entity_id);

    if (!targetData.data) {
      player.sendError("Could not find your target!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cMember Manager",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nYour currently managing §g${
        targetData.data.username
      }§7 and they are currently ${
        !world.findPlayer(target.entity_id) ? "§coffline" : "§aonline"
      }§7!\n\nPlease select an option below!\n\n`,
      buttons: [
        {
          text: "Manage Permissions",
          subtext: "Click to Open",
          icon: "textures/ui/settings_glyph_color_2x",
        },
        {
          text: "Transfer Ownership",
          subtext: "Click to Open",
          icon: "textures/ui/op",
        },
        {
          text: "Kick Member",
          subtext: "Click to Open",
          icon: "textures/ui/icon_import",
        },
      ],
    });

    switch (form.selection) {
      case 0: {
        const form = await Form.ModalForm({
          player: player,
          title: "§cMember Permissions",
          options: [
            {
              type: "toggle",
              label: "§cBuilding Permissions",
              default: target.permissions.build,
            },
            {
              type: "toggle",
              label: "§cBreaking Permissions",
              default: target.permissions.break,
            },
            {
              type: "toggle",
              label: "§cOpening Container Permissions",
              default: target.permissions.containers,
            },
            {
              type: "toggle",
              label: "§cInviting Permissions",
              default: target.permissions.inviting,
            },
            {
              type: "toggle",
              label: "§cLoading Plot Permissions",
              default: target.permissions.loading,
            },
            {
              type: "toggle",
              label: "§cPickup Generators Permission",
              default: target.permissions.pickup,
            },
          ],
        });

        if (!form.formValues) {
          player.sendError("Form closed.");
          return;
        }

        const build = form.formValues[0] as boolean;
        const breaking = form.formValues[1] as boolean;
        const containers = form.formValues[2] as boolean;
        const inviting = form.formValues[3] as boolean;
        const loading = form.formValues[4] as boolean;
        const pickup = form.formValues[5] as boolean;

        await API.Plots.UpdateMember(target.plot_id, target.entity_id, {
          permissions: {
            build,
            break: breaking,
            containers,
            inviting,
            loading,
            pickup,
          },
        });

        player.sendSuccess(
          `Successfully updated permissions for §g${targetData.data.username}§a!`
        );
        return;
      }
      case 1: {
        const form = await Form.ActionForm({
          player: player,
          title: "§cTransfer Ownership",
          body: `§7Hello, §l§c${player.name}§r§7!\n\nAre you sure that you would like to transfer ownership to §g${targetData.data.username}§7?\n\n`,
          buttons: [
            {
              text: "Confirm",
              subtext: "Click to Transfer",
              icon: "textures/blocks/glass_green",
            },
            {
              text: "Cancel",
              subtext: "Click to Cancel",
              icon: "textures/blocks/glass_red",
            },
          ],
        });

        switch (form.selection) {
          case undefined:
            player.sendError("Form closed.");
            return;
          case 0:
            await API.Plots.TransferOwnership(target.plot_id, target.entity_id);

            player.sendSuccess(
              `Successfully transferred ownership to §g${targetData.data.username}§a!`
            );

            const targetMember = world.findPlayer(target.entity_id);

            if (targetMember) {
              targetMember.sendSuccess(
                `You have been transferred ownership for your plot!`
              );
            }
            return;
          case 1:
            player.sendWarning("Ownership transfer cancelled.");
            return;
        }

        return;
      }
      case 2: {
        const form = await Form.ActionForm({
          player: player,
          title: "§cKick Member",
          body: `§7Hello, §l§c${player.name}§r§7!\n\nAre you sure that you would like to kick §g${targetData.data.username}§7?\n\n`,
          buttons: [
            {
              text: "Confirm",
              subtext: "Click to Kick",
              icon: "textures/blocks/glass_green",
            },
            {
              text: "Cancel",
              subtext: "Click to Cancel",
              icon: "textures/blocks/glass_red",
            },
          ],
        });

        switch (form.selection) {
          case undefined:
            player.sendError("Form closed.");
            return;
          case 0:
            await API.Plots.DeleteMember(target.entity_id);

            const members = await API.Plots.PlotMembers(target.plot_id);
            const kicker = player.name;

            if (!members.data) {
              player.sendError("Could not find your plot members!");
              return;
            }

            for (const memberData of members.data) {
              const member = world.findPlayer(memberData.entity_id);

              if (!member) {
                continue;
              }

              member.sendWarning(
                `§g${kicker}§e has kicked §g${targetData.data.username}§e from the plot!`
              );
            }

            const targetMember = world.findPlayer(target.entity_id);

            if (targetMember) {
              targetMember.sendError(
                `You have been kicked from the plot by §g${kicker}§c!`
              );
            }
            return;
          case 1:
            player.sendWarning("Kick cancelled.");
            return;
        }
      }
    }
  }

  public static async InitPage(player: Player): Promise<void> {
    const form = await Form.ActionForm({
      player: player,
      title: "§cPlot Menu",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nPlease select an option down below!\n\n`,
      buttons: [
        {
          text: "Create a Plot",
          subtext: "Click to Open",
          icon: "textures/ui/color_plus",
        },
        {
          text: "Plot Invites",
          subtext: "Click to Open",
          icon: "textures/ui/mail_icon",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        player.sendError("Form closed.");
        return;
      case 0:
        this.CreatePlot(player);
        return;
      case 1:
        this.JoinPlotPage(player);
        return;
    }
  }
  public static async JoinPlotPage(player: Player): Promise<void> {
    const invites = await API.Plots.MemberInvites(player.id);

    if (!invites.data) {
      player.sendError("Could not find your plot invites!");
      return;
    }
    if (invites.data.length === 0) {
      player.sendError("You do not have any plot invites!");
      return;
    }

    const form = await Form.ActionForm({
      player: player,
      title: "§cPlot Invites",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nPlease select a plot invite below!\n\n`,
      buttons: await Promise.all(
        invites.data.map(async (invite) => {
          const profile = await API.Profiles.Profile(invite.sender);

          if (!profile.data) {
            return {
              text: "Unknown Profile",
              subtext: "Click to Delete",
              icon: "textures/ui/mail_icon",
            };
          }

          return {
            text: profile.data.username,
            subtext: "Click to Accept",
            icon: "textures/ui/mail_icon",
          };
        })
      ),
    });

    if (form.selection === undefined) {
      player.sendError("Form closed.");
      return;
    }

    const invite = invites.data[form.selection];

    if (!invite) {
      player.sendError("Could not find your plot invite!");
      return;
    }

    const request = await API.Plots.AcceptInvite(invite.plot_id, invite._id);

    switch (request.status) {
      case 200:
        const members = await API.Plots.PlotMembers(invite.plot_id);

        if (!members.data) {
          player.sendError("Could not find your plot members!");
          return;
        }

        const target = world.findPlayer(invite.target);

        if (!target) {
          return;
        }

        for (const memberData of members.data) {
          const member = world.findPlayer(memberData.entity_id);

          if (!member) {
            continue;
          }

          member.sendSuccess(`§g${target.name}§a has joined your plot!`);
        }

        return;
      case 204:
        player.sendError("This plot has max members!");
        return;
      case 400:
        player.sendError("Error accepting invite!");
        return;
      case 404:
        player.sendError("Could not find your plot invite!");
        return;
      case 409:
        player.sendError("You are already in a plot!");
        return;
    }
  }
  public static async CreatePlot(player: Player): Promise<void> {
    const request = await API.Plots.CreatePlot({
      created_by: player.id,
    });

    switch (request.status) {
      case 200:
        const plotMember = await API.Plots.Member(player.id);

        if (!plotMember.data) {
          player.sendError("Could not find your plot member data!");
          return;
        }

        const structure = world.structureManager.get(
          Config.plot_default_structure
        );

        if (!structure) {
          await API.Plots.DeletePlot(plotMember.data.plot_id);

          player.sendError(
            "It seems our default plot is missing, please contact support!"
          );
          return;
        }

        structure.saveAs(
          `plot:${plotMember.data.plot_id}`,
          StructureSaveMode.World
        );

        player.sendSuccess(
          `Successfully created your plot! Please access the plot menu again to access the control panel.`
        );
        return;
      case 400:
        player.sendError("Error creating plot!");
        return;
      case 404:
        player.sendError("Could not find your plot member data!");
        return;
      case 409:
        player.sendError("You already have a plot!");
        return;
    }
  }

  public static async PickupPage(player: Player, block: Block): Promise<void> {
    const form = await Form.ActionForm({
      player: player,
      title: "§cGenerator Pickup",
      body: `§7Hello, §l§c${player.name}§r§7!\n\nAre you sure you would like to pickup this generator?\n\n`,
      buttons: [
        {
          text: "Yes",
          subtext: "Click to Open",
          icon: "textures/ui/confirm",
        },
        {
          text: "No",
          subtext: "Click to Close",
          icon: "textures/ui/cancel",
        },
      ],
    });

    if (form.selection === undefined || form.selection === 1) {
      player.sendError("Form closed.");
      return;
    }
    if (player.emptyInventorySlots() === 0) {
      player.sendError("You do not have enough inventory space!");
      return;
    }

    const above = block.above();

    if (!above || above.typeId === "minecraft:air") {
      player.sendError("Could not find the generator!");
      return;
    }

    const item = Item.Create({
      typeId: block.typeId,
      nameTag: `§c${Formatter.ReadableTypeId(above.typeId)} Generator`,
      amount: 1,
      keepOnDeath: true,
    });

    world
      .overworld()
      .fillBlocks(
        new BlockVolume(block.location, above.location),
        "minecraft:air"
      );

    player.addInventoryItem(item);
    player.sendSuccess("Successfully picked up the generator!");
  }

  public static async SlotTaken(slot: number): Promise<boolean> {
    const plots = await API.Plots.ActivePlots();

    if (!plots.data) {
      return true;
    }

    return plots.data.some((plot) => plot.slot === slot);
  }

  public static EjectProtection(): void {
    system.runInterval(async () => {
      const plots = Object.values(Cache.Plots);
      const plotSlots = Config.plot_slots;
      const plotMembers = Cache.PlotMembers;
      const players = world.getAllPlayers();

      for (const slot of plotSlots) {
        const plot = plots.find((plot) => plot.slot === slot.slot);
        const warp = slot.locations[
          Math.floor(Math.random() * slot.locations.length)
        ] as Vector3;

        for (const player of players) {
          const inside = Location.Inside(slot.saveZone, player.location);

          if (!inside) {
            continue;
          }
          if (!plot) {
            player.teleport(warp);
            player.sendError(`No one has this plot claimed!`);
            continue;
          }
          if (this.Raidnight) {
            continue;
          }

          const plotMember = plotMembers.find(
            (entry) => entry.entity_id === player.id
          );

          if (!plotMember || plotMember.plot_id !== plot._id) {
            player.teleport(warp);
            player.sendError(`You are not allowed in this plot!`);
            continue;
          }
        }
      }
    }, Config.plot_eject_interval);
  }

  /**
   * MAKE SURE PLOT IS LOADED!
   */
  public static SavePlot(plot_id: string, slot: PlotSlot): void {
    const manager = world.structureManager;

    manager.delete(`plot:${plot_id}`);
    manager.createFromWorld(
      `plot:${plot_id}`,
      world.overworld(),
      slot.saveZone[0],
      slot.saveZone[1],
      {
        saveMode: StructureSaveMode.World,
        includeEntities: false,
      }
    );
  }
  public static GetRotation(
    current: number,
    needed: number
  ): StructureRotation {
    let difference = (needed - current) % 360;

    if (difference < 0) {
      difference += 360;
    }

    switch (difference) {
      case 0:
        return StructureRotation.None;
      case 90:
        return StructureRotation.Rotate90;
      case 180:
        return StructureRotation.Rotate180;
      case 270:
        return StructureRotation.Rotate270;
      default:
        return StructureRotation.None;
    }
  }

  private static async PlotRecovery(): Promise<void> {
    await Sleep(0);

    world.runCommand("tickingarea remove_all");

    if (world.getAllPlayers().length !== 0) {
      return;
    }

    const activePlots = await API.Plots.ActivePlots();
    const defaultPlot = world.structureManager.get(
      Config.plot_default_structure
    );

    if (!activePlots.data) {
      Logger.Error("Failed to get active plots.");
      return;
    }

    if (activePlots.data.length === 0) {
      Plots.AllowPlayers = true;

      Logger.Notice("No plots to unload.");
      return;
    }
    if (!defaultPlot) {
      Logger.Error("Default plot not found.");
      return;
    }

    Logger.Info(`Unloading ${activePlots.data.length} plots...`);

    for (const player of world.getAllPlayers()) {
      const { data: profile } = await API.Profiles.Profile(player.id);

      if (profile && profile.admin) {
        continue;
      }

      player.disconnect(
        "Plots are currently being unloaded. You are not allowed to be in the server during this process to protect against progress loss."
      );
    }

    world.broadcastWarning("Plot recovery has started!");

    for (let i = 0; i < activePlots.data.length; i++) {
      const plot = activePlots.data[i];

      if (!plot) {
        Logger.Error(`Missing plot data!`);
        continue;
      }

      const slot = Config.plot_slots.find((entry) => entry.slot === plot.slot);

      if (!slot) {
        Logger.Error(`Missing plot slot!`);
        continue;
      }

      const tickingID = await world.loadArea(slot.saveZone[0]);

      Plots.SavePlot(plot._id, slot);

      await Sleep(5);
      await API.Plots.UpdatePlot(plot._id, { slot: 0 });

      world.structureManager.place(
        defaultPlot,
        world.overworld(),
        slot.saveZone[0],
        {
          animationMode: StructureAnimationMode.Layers,
          animationSeconds: 5,
          includeEntities: false,
        }
      );

      await Sleep(20 * 5);

      world.unloadArea(tickingID);

      Logger.Notice(`Unloaded plot ${slot.slot}`);
    }

    Plots.AllowPlayers = true;

    Logger.Info("Plots unloaded.");
    world.broadcastSuccess("Plot recovery has finished!");
  }
  private static async OptimizePlots(): Promise<void> {
    const plots = await API.Plots.AllPlots();
    let deleted = 0;

    if (!plots.data) {
      Logger.Error("Failed to get plots.");
      return;
    }

    const structureIDs = world.structureManager
      .getWorldStructureIds()
      .filter((entry) => entry.startsWith("plot:"));

    for (const id of structureIDs) {
      if (!plots.data.some((entry) => id.includes(entry._id))) {
        world.structureManager.delete(id);
        deleted++;
      }
    }

    if (deleted === 0) {
      return;
    }

    Logger.Notice(`Deleted ${deleted} plots.`);
  }

  private static UpdateRaidnight(): void {
    const line = "§7======================";

    system.runInterval(() => {
      const time = world.getTimeOfDay();
      const isRaidnight =
        Config.raidnight_start < Config.raidnight_end
          ? time >= Config.raidnight_start && time < Config.raidnight_end
          : time >= Config.raidnight_start || time < Config.raidnight_end;

      if (isRaidnight && !this.Raidnight) {
        this.Raidnight = true;

        world.gameRules.keepInventory = false;
        world.gameRules.pvp = true;

        world.broadcast(
          [
            line,
            `§l§cRaidnight Has Begun!`,
            `§r§7Plot Raiding: §cTrue\n`,
            `§eRemember, plot griefing is not allowed!`,
            line,
          ].join("\n")
        );

        for (const player of world.getAllPlayers()) {
          player.playSound(CommonSounds.RAIDNIGHT_START, {
            pitch: 0.7,
          });
        }
      }
      if (!isRaidnight && (this.Raidnight === undefined || this.Raidnight)) {
        this.Raidnight = false;

        world.gameRules.keepInventory = true;
        world.gameRules.pvp = false;

        world.broadcast(
          [
            line,
            `§l§aRaidnight Has Ended!`,
            `§r§7Plot Raiding: §aFalse\n`,
            `§eTake this as time to work on your plot, and build up your generators!`,
            line,
          ].join("\n")
        );
        for (const player of world.getAllPlayers()) {
          player.playSound(CommonSounds.RAIDNIGHT_END, {
            pitch: 0.5,
          });
        }
      }
    }, Config.raidnight_interval);
  }
  private static UpdatePlotTags(): void {
    system.runInterval(() => {
      for (const player of world.getAllPlayers()) {
        const plotTags = player
          .getTags()
          .filter((tag) => tag.startsWith("plot") && !tag.endsWith("s"));
        const member = Cache.PlotMembers.find(
          (entry) => entry.entity_id === player.id
        );
        const plot = Cache.Plots.find((entry) => entry._id === member?.plot_id);

        if (!member || !plot) {
          for (const tag of plotTags) {
            player.removeTag(tag);
          }

          continue;
        }
        if (!plot) {
          continue;
        }

        if (plotTags.length > 1) {
          for (const tag of plotTags) {
            if (!tag.endsWith(plot.slot.toString())) {
              player.removeTag(tag);
            }
          }
        }
        if (!plotTags.some((tag) => tag.endsWith(plot.slot.toString()))) {
          player.addTag(`plot${plot.slot}`);
        }
      }
    }, Config.plot_tag_interval);
  }
}
