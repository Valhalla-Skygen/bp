import {
  system,
  world,
  type ChatSendBeforeEvent,
  type Player,
} from "@minecraft/server";
import Config from "../lib/config";
import Cache from "../utils/cache";

export default class ChatRanks {
  public static OnChat(event: ChatSendBeforeEvent): void {
    const { sender: player, message } = event;

    event.cancel = true;

    const messages = Cache.ChatMessages[player.id] ?? 0;
    const profile = Cache.Profiles.find(
      (entry) => entry.entity_id === player.id
    );

    if (messages >= Config.chat_limit && !profile?.admin) {
      system.run(() =>
        player.sendError("Please wait before sending another message.")
      );
      return;
    }

    Cache.ChatMessages[player.id] = messages + 1;

    const ranks = this.GetRanks(player);

    world.broadcast(`${ranks} §7${player.name} §8>> §f${message}`);
  }

  private static GetRanks(player: Player): string {
    const userRanks =
      Config.chat_ranks.find(
        (entry) => entry.username.toLowerCase() === player.name.toLowerCase()
      )?.ranks ?? [];

    if (userRanks.length > 0) {
      const rankNames = userRanks
        .map(
          (rankId) =>
            Config.chat_rank_definitions.find((def) => def.id === rankId)
              ?.name ?? rankId
        )
        .join(" ");
      return `${rankNames}`;
    }

    return "";
  }
}
