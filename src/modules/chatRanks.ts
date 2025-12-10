import {
  system,
  type ChatSendBeforeEvent,
  type Player,
} from "@minecraft/server";
import Config from "../lib/config";
import Cache from "../utils/cache";
import Member from "../utils/wrappers/member";
import World from "../utils/wrappers/world";

export default class ChatRanks {
  public static OnChat(event: ChatSendBeforeEvent): void {
    const { sender, message } = event;

    event.cancel = true;

    const member = new Member(sender);
    const messages = Cache.ChatMessages[member.EntityID()] ?? 0;
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === member.EntityID()
    );

    if (messages >= Config.chat_limit && !profile?.admin) {
      system.run(() =>
        member.SendError("Please wait before sending another message.")
      );
      return;
    }

    Cache.ChatMessages[member.EntityID()] = messages + 1;

    const ranks = this.GetRanks(sender);

    World.Broadcast(`${ranks} §7${member.Username()} §8>> §f${message}`);
  }

  private static GetRanks(player: Player): string {
    const userRanks = Config.chat_ranks.find(
      (entry) => entry.username.toLowerCase() === player.name.toLowerCase()
    )?.ranks ?? [];

    if (userRanks.length > 0) {
      const rankNames = userRanks
        .map(
          (rankId) =>
            Config.chat_rank_definitions.find((def) => def.id === rankId)?.name ??
            rankId
        )
        .join(" ");
      return `${rankNames}`;
    }

    return "";
  }
}
