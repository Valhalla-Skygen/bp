import { Player, world } from "@minecraft/server";
import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Formatter from "../utils/formatter";
import TargetFinder from "../utils/targetFinder";

export default class Transfer {
  public static async View(player: Player): Promise<void> {
    const target = await TargetFinder.OfflineSearch(player);

    if (!target) {
      return;
    }
    if (target.entity_id === player.id) {
      player.sendError("You cannot transfer to yourself!");
      return;
    }

    const profile = Cache.Profiles.find(
      (profile) => profile.entity_id === player.id
    );
    const form = await Form.ModalForm({
      player: player,
      title: "§cTransfer Menu",
      options: [
        {
          type: "label",
          label: `§7Current Balance: §a$${Formatter.ToShort(
            profile?.balance ?? 0
          )}`,
        },
        {
          type: "textfield",
          label: "§7Please enter the amount you would like to transfer below!",
          ghost: "10000",
          tooltip: "Please enter a non formatted\nnumber, e.g. 10000",
        },
      ],
    });

    if (!form.formValues) {
      player.sendError("Form closed.");
      return;
    }

    const amount = parseInt(form.formValues[1] as string);

    if (isNaN(amount) || amount <= 0) {
      player.sendError("Please enter a valid number!");
      return;
    }

    const request = await API.Profiles.Transfer(player.id, {
      target: target.entity_id,
      amount,
    });
    const targetMember = world.findPlayer(target.entity_id);

    switch (request.status) {
      case 200:
        player.sendSuccess(
          `Successfully transferred $${amount} to ${target.username}!`
        );

        if (targetMember) {
          targetMember.sendSuccess(
            `You have received $${amount} from ${player.name}!`
          );
        }
        break;
      case 402:
        player.sendError("You do not have enough money for this transfer!");
        break;
      case 409:
        player.sendError("You cannot transfer to yourself!");
        break;

      default:
        player.sendError("Failed to transfer money.");
    }
  }
}
