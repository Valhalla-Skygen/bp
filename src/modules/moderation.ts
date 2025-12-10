import type { PlayerSpawnAfterEvent } from "@minecraft/server";
import Config from "../lib/config";
import type { Ban } from "../types/moderation";
import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import TargetFinder from "../utils/targetFinder";
import Member from "../utils/wrappers/member";
import World from "../utils/wrappers/world";

export default class Moderation {
  public static async OnSpawn(event: PlayerSpawnAfterEvent): Promise<void> {
    const { initialSpawn, player } = event;

    if (!initialSpawn) {
      return;
    }

    const member = new Member(player);
    const { data: warnings } = await API.Moderation.Warnings(member.EntityID());
    const { data: bans } = await API.Moderation.ActiveBans(member.EntityID());

    if (bans && bans.length > 0) {
      const ban = bans.shift() as Ban;

      member.Disconnect(
        [
          `§c§lYou have been banned!`,
          `§7Reason: ${ban.reason}`,
          `§7Expires: ${
            ban.expires_at === null
              ? "§eNever!"
              : `§c${new Date(ban.expires_at).toLocaleString()} UTC`
          }`,
          `§7Discord: §cdiscord.gg/Tmmv3mHQv3`,
        ].join("\n")
      );
    }
    if (
      warnings &&
      warnings.filter((warning) => warning.active).length >=
        Config.warning_limit
    ) {
      member.Disconnect(
        [
          `§c§lYou have reached max warnings!`,
          `§r§7Discord: §cdiscord.gg/Tmmv3mHQv3`,
        ].join("\n")
      );
      return;
    }
  }

  public static async View(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cModeration",
      body: `§7Hello, §c§l${member.Username()}§r§7! Please select an option of moderation down below!`,
      buttons: [
        {
          text: "Banning",
          subtext: "Click to Open",
          icon: "textures/ui/hammer_r_disabled",
        },
        {
          text: "Warning",
          subtext: "Click to Open",
          icon: "textures/ui/Caution",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        member.SendError("Form closed.");
        break;
      case 0:
        Moderation.BanMenu(member);
        break;
      case 1:
        Moderation.WarnMenu(member);
        break;
    }
  }

  public static async WarnMenu(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cWarning Menu",
      body: `§7Hello, §c§l${member.Username()}§r§7! Please select an option of warning down below!`,
      buttons: [
        {
          text: "Get Member's Warnings",
          subtext: "Click to Open",
          icon: "textures/items/book_writable",
        },
        {
          text: "Warn a Member",
          subtext: "Click to Open",
          icon: "textures/ui/icon_lock",
        },
        {
          text: "Unwarn a Member",
          subtext: "Click to Open",
          icon: "textures/ui/icon_unlocked",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        member.SendError("Form closed.");
        break;
      case 0:
        Moderation.GetWarnings(member);
        break;
      case 1:
        Moderation.Warn(member);
        break;
      case 2:
        Moderation.Unwarn(member);
        break;
    }
  }
  public static async GetWarnings(member: Member): Promise<void> {
    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }

    const { data: warnings } = await API.Moderation.Warnings(target.entity_id);

    if (warnings === null) {
      member.SendError(`Error while getting ${target.username}'s warnings!`);
      return;
    }
    if (warnings.length === 0) {
      member.SendError(`${target.username} has no warnings!`);
      return;
    }

    const activeWarnings = warnings.filter(
      (warning) => warning.active === true
    );
    const revokedWarnings = warnings.filter(
      (warning) => warning.active === false
    );
    const usernameCache: Record<string, string> = {};

    for (const warning of warnings) {
      if (usernameCache[warning.staff]) {
        continue;
      }
      if (warning.method === "system") {
        usernameCache[warning.staff] = "SYSTEM";
        continue;
      }
      if (warning.method === "discord") {
        usernameCache[warning.staff] = "Discord Admin";
        continue;
      }

      const { data: staff } = await API.Profiles.Profile(warning.staff);

      if (!staff) {
        usernameCache[warning.staff] = "Unknown Admin";
        continue;
      }

      usernameCache[warning.staff] = staff.username;
    }

    Form.ActionForm({
      member,
      title: `${target.username}'s Warnings`,
      body: [
        `§e§lAll warnings are shown in UTC timezone§r.\n`,
        `§7Here is all of §l§c${target.username}§r§7's warnings.\n`,
        `§l§cActive Warnings§r§7:`,
        activeWarnings.length === 0
          ? "§eNone!"
          : activeWarnings
              .map((warning, index) => {
                return [
                  `§7Warning #§c${index + 1}`,
                  `§cStaff: §7${usernameCache[warning.staff]}`,
                  `§cReason: §7${warning.reason}`,
                  `§cMethod: §7${warning.method}`,
                  `§cCreated At: §7${new Date(
                    warning.created_at
                  ).toLocaleString()}`,
                ].join("\n");
              })
              .join("\n"),
        `\n§l§cRevoked Warnings§r§7:`,
        revokedWarnings.length === 0
          ? "§eNone!"
          : revokedWarnings
              .map((warning, index) => {
                return [
                  `§l§7Warning #§c${index + 1}§r`,
                  `§cStaff: §7${usernameCache[warning.staff]}`,
                  `§cReason: §7${warning.reason}`,
                  `§cMethod: §7${warning.method}`,
                  `§cCreated At: §7${new Date(
                    warning.created_at
                  ).toLocaleString()}`,
                ].join("\n");
              })
              .join("\n"),
      ].join("\n"),
      buttons: [],
    });
  }
  public static async Warn(member: Member): Promise<void> {
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === member.EntityID()
    );

    if (!profile || !profile.admin) {
      member.SendError("You are not an admin!");
      return;
    }

    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }
    if (target.admin) {
      member.SendError("You cannot warn an admin!");
      return;
    }

    const form = await Form.ModalForm({
      member,
      title: "§cWarn Member",
      options: [
        {
          type: "label",
          label: `§7Hello, §c§l${member.Username()}§r§7!\n`,
        },
        {
          type: "textfield",
          label: "§7Please enter the reason for the warning below!",
          ghost: "Chat Spamming",
        },
      ],
    });

    if (form.formValues === undefined) {
      member.SendError("Form closed.");
      return;
    }

    const reason = form.formValues[1] as string;
    const { data: warnings } = await API.Moderation.Warnings(target.entity_id);

    if (!Array.isArray(warnings)) {
      member.SendError(`Error while getting ${target.username}'s warnings!`);
      return;
    }

    const { status } = await API.Moderation.CreateWarning(target.entity_id, {
      staff: member.EntityID(),
      reason,
      method: "ingame",
    });
    const targetMember = World.FindMember(target.entity_id);

    switch (status) {
      case 200:
        World.BroadcastWarning(
          [
            `§l§c${member.Username()}§r§7 warned §l§c${target.username}§r§7!`,
            `§cReason: §7${reason}`,
          ].join("\n")
        );

        if (targetMember && warnings.length + 1 >= Config.warning_limit) {
          targetMember.Disconnect(
            [
              `§c§lYou have reached max warnings!`,
              `§r§7Staff: §c${member.Username()}`,
              `§7Reason: §c${reason}`,
              `§7Discord: §cdiscord.gg/Tmmv3mHQv3`,
            ].join("\n")
          );
        }
        break;

      default:
        member.SendError(`Error while warning ${target.username}!`);
        break;
    }
  }
  public static async Unwarn(member: Member): Promise<void> {
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === member.EntityID()
    );

    if (!profile || !profile.admin) {
      member.SendError("You are not an admin!");
      return;
    }

    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }

    const { data: warnings } = await API.Moderation.Warnings(target.entity_id);

    if (!Array.isArray(warnings)) {
      member.SendError(`Error while getting ${target.username}'s warnings!`);
      return;
    }

    if (warnings.length === 0) {
      member.SendError(`${target.username} has no warnings!`);
      return;
    }

    warnings.forEach((warning, index) => {
      if (warning.active) {
        return;
      }

      warnings.splice(index, 1);
    });

    if (warnings.length === 0) {
      member.SendError(`${target.username} has no active warnings!`);
      return;
    }

    const form = await Form.ActionForm({
      member,
      title: "§cUnwarn Member",
      body: `§7Hello, §c§l${member.Username()}§r§7!\n\nPlease select a warning below to revoke it!`,
      buttons: warnings.map((warning) => {
        const reasonPreview = warning.reason.slice(0, 25);

        return {
          text:
            reasonPreview.length === 25 ? `${reasonPreview}...` : reasonPreview,
          subtext: "Click to Open",
          icon: "textures/items/book_enchanted",
        };
      }),
    });

    if (form.selection === undefined) {
      member.SendError("Form closed.");
      return;
    }

    const warning = warnings[form.selection];

    if (!warning) {
      member.SendError("Invalid warning!");
      return;
    }

    const { status } = await API.Moderation.DisableWarning(
      target.entity_id,
      warning._id
    );

    switch (status) {
      case 200:
        World.BroadcastWarning(
          [
            `§l§c${member.Username()} §r§7has revoked §l§c${
              target.username
            }§r§7's warning!`,
            `§7Reason: §c${warning.reason}`,
          ].join("\n")
        );
        break;
      case 409:
        member.SendError(`Warning was already revoked!`);
        break;
      default:
        member.SendError(
          `Error while revoking warning from ${target.username}!`
        );
        break;
    }
  }

  public static async BanMenu(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      member,
      title: "§cBan Menu",
      body: `§7Hello, §c§l${member.Username()}§r§7! Please select an option of banning down below!`,
      buttons: [
        {
          text: "Get Member's Bans",
          subtext: "Click to Open",
          icon: "textures/items/book_writable",
        },
        {
          text: "Ban a Member",
          subtext: "Click to Open",
          icon: "textures/ui/icon_lock",
        },
        {
          text: "Unban a Member",
          subtext: "Click to Open",
          icon: "textures/ui/icon_unlocked",
        },
      ],
    });

    switch (form.selection) {
      case undefined:
        member.SendError("Form closed.");
        break;
      case 0:
        Moderation.GetBans(member);
        break;
      case 1:
        Moderation.Ban(member);
        break;
      case 2:
        Moderation.Unban(member);
        break;
    }
  }
  public static async GetBans(member: Member): Promise<void> {
    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }

    const { data: bans } = await API.Moderation.Bans(target.entity_id);

    if (bans === null) {
      member.SendError(`Error while getting ${target.username}'s bans!`);
      return;
    }
    if (bans.length === 0) {
      member.SendError(`${target.username} has no bans!`);
      return;
    }

    const activeBans = bans.filter(
      (ban) =>
        ban.active && (!ban.expires_at || new Date(ban.expires_at) > new Date())
    );
    const nonActiveBans = bans.filter(
      (ban) =>
        ban.active && ban.expires_at && new Date(ban.expires_at) < new Date()
    );
    const revokedBans = bans.filter((ban) => !ban.active);
    const usernameCache: Record<string, string> = {};

    for (const ban of bans) {
      if (usernameCache[ban.staff]) {
        continue;
      }
      if (ban.method === "system") {
        usernameCache[ban.staff] = "SYSTEM";
        continue;
      }
      if (ban.method === "discord") {
        usernameCache[ban.staff] = "Discord Admin";
        continue;
      }

      const { data: staff } = await API.Profiles.Profile(ban.staff);

      if (!staff) {
        usernameCache[ban.staff] = "Unknown Admin";
        continue;
      }

      usernameCache[ban.staff] = staff.username;
    }

    Form.ActionForm({
      member,
      title: `${target.username}'s Bans`,
      body: [
        `§e§lAll bans are shown in UTC timezone§r.\n`,
        `§7Here is all of §l§c${target.username}§r§7's bans.\n`,
        `§l§cActive Bans§r§7:`,
        activeBans.length === 0
          ? "§eNone!"
          : activeBans
              .map((ban, index) => {
                return [
                  `§7Ban #§c${index + 1}`,
                  `§cStaff: §7${usernameCache[ban.staff]}`,
                  `§cReason: §7${ban.reason}`,
                  `§cMethod: §7${ban.method}`,
                  `§cCreated At: §7${new Date(
                    ban.created_at
                  ).toLocaleString()}`,
                  `§cExpires At: ${
                    ban.expires_at === null
                      ? "§eNever"
                      : `§7${new Date(ban.expires_at).toLocaleString()}`
                  }`,
                ].join("\n");
              })
              .join("\n"),
        `\n§l§cNon-Active Bans§r§7:`,
        nonActiveBans.length === 0
          ? "§eNone!"
          : nonActiveBans
              .map((ban, index) => {
                return [
                  `§7Ban #§c${index + 1}`,
                  `§cStaff: §7${usernameCache[ban.staff]}`,
                  `§cReason: §7${ban.reason}`,
                  `§cMethod: §7${ban.method}`,
                  `§cCreated At: §7${new Date(
                    ban.created_at
                  ).toLocaleString()}`,
                  `§cExpires At: ${
                    ban.expires_at === null
                      ? "§eNever"
                      : `§7${new Date(ban.expires_at).toLocaleString()}`
                  }`,
                ].join("\n");
              })
              .join("\n"),
        `\n§l§cRevoked Bans§r§7:`,
        revokedBans.length === 0
          ? "§eNone!"
          : revokedBans.map((ban, index) => {
              return [
                `§7Ban #§c${index + 1}`,
                `§cStaff: §7${usernameCache[ban.staff]}`,
                `§cReason: §7${ban.reason}`,
                `§cMethod: §7${ban.method}`,
                `§cCreated At: §7${new Date(ban.created_at).toLocaleString()}`,
                `§cExpires At: ${
                  ban.expires_at === null
                    ? "§eNever"
                    : `§7${new Date(ban.expires_at).toLocaleString()}`
                }`,
              ].join("\n");
            }),
      ].join("\n"),
      buttons: [],
    });
  }
  public static async Ban(member: Member): Promise<void> {
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === member.EntityID()
    );

    if (!profile || !profile.admin) {
      member.SendError("You are not an admin!");
      return;
    }

    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }
    if (target.admin) {
      member.SendError("You cannot ban an admin!");
      return;
    }

    const form = await Form.ModalForm({
      member,
      title: "§cBan Member",
      options: [
        {
          type: "label",
          label: `§7Hello, §c§l${member.Username()}§r§7!\n`,
        },
        {
          type: "textfield",
          label: "§7Please enter the reason for the ban below!",
          ghost: "Griefing",
        },
        {
          type: "dropdown",
          label: "§7Please select the duration of the ban below!",
          options: Config.banning_durations.map((duration) => duration.label),
          default: 0,
        },
      ],
    });

    if (form.formValues === undefined) {
      member.SendError("Form closed.");
      return;
    }

    const reason = form.formValues[1] as string;
    const durationIndex = form.formValues[2] as number;
    const duration = Config.banning_durations[durationIndex];

    if (!duration) {
      member.SendError("Invalid duration!");
      return;
    }

    const { status } = await API.Moderation.CreateBan(target.entity_id, {
      staff: member.EntityID(),
      method: "ingame",
      reason,
      expires_at:
        duration.minutes === null
          ? null
          : new Date(Date.now() + duration.minutes * 60 * 1000),
    });
    const targetMember = World.FindMember(target.entity_id);

    switch (status) {
      case 200:
        World.BroadcastWarning(
          [
            `§l§c${member.Username()} §r§7has banned §l§c${
              target.username
            }§r§7!`,
            `§7Reason: §c${reason}`,
            `§7Duration: §c${duration.label}`,
          ].join("\n")
        );

        if (targetMember) {
          targetMember.Disconnect(
            [
              `§c§lYou have been banned!`,
              `§7Staff: §c${member.Username()}`,
              `§7Reason: §c${reason}`,
              `§7Duration: §c${duration.label}`,
              `§7Discord: §cdiscord.gg/Tmmv3mHQv3`,
            ].join("\n")
          );
        }
        break;
      case 409:
        member.SendError("Member is already banned!");
        break;
      default:
        member.SendError("Failed to ban member!");
        break;
    }
  }
  public static async Unban(member: Member): Promise<void> {
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === member.EntityID()
    );

    if (!profile || !profile.admin) {
      member.SendError("You are not an admin!");
      return;
    }

    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }

    const { data: bans } = await API.Moderation.Bans(target.entity_id);

    if (!Array.isArray(bans)) {
      member.SendError("Failed to get member's bans!");
      return;
    }
    if (bans.length === 0) {
      member.SendError(`${target.username} has no bans!`);
      return;
    }

    bans.forEach((ban, index) => {
      if (
        !ban.active ||
        (typeof ban.expires_at === "string" &&
          new Date(ban.expires_at) > new Date())
      ) {
        return;
      }

      bans.splice(index, 1);
    });

    if (bans.length === 0) {
      member.SendError(`${target.username} has no active bans!`);
      return;
    }

    const form = await Form.ActionForm({
      member,
      title: "§cUnban Member",
      body: `§7Hello, §c§l${member.Username()}§r§7!\n\nPlease select a ban below to revoke it!\n\n`,
      buttons: bans.map((ban) => {
        const reasonPreview = ban.reason.slice(0, 25);

        return {
          text:
            reasonPreview.length === 25 ? `${reasonPreview}...` : reasonPreview,
          subtext: "Click to Open",
          icon: "textures/items/book_enchanted",
        };
      }),
    });

    if (form.selection === undefined) {
      member.SendError("Form closed.");
      return;
    }

    const ban = bans[form.selection];

    if (!ban) {
      member.SendError("Invalid ban!");
      return;
    }

    const { status } = await API.Moderation.DisableBan(
      target.entity_id,
      ban._id
    );

    switch (status) {
      case 200:
        World.BroadcastWarning(
          [
            `§l§c${member.Username()} §r§7has revoked §l§c${
              target.username
            }§r§7's ban!`,
            `§7Reason: §c${ban.reason}`,
          ].join("\n")
        );
        break;
      case 409:
        member.SendError("Ban was already revoked!");
        break;
      default:
        member.SendError("Failed to unban member!");
        break;
    }
  }
}
