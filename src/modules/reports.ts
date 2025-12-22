import type { Player } from "@minecraft/server";
import API from "../utils/API/API";
import Form from "../utils/form/form";
import TargetFinder from "../utils/targetFinder";

export default class Reports {
  public static async Create(player: Player): Promise<void> {
    const target = await TargetFinder.OfflineSearch(player);

    if (!target) {
      return;
    }
    if (target.entity_id === player.id) {
      player.sendError("You cannot report yourself!");
      return;
    }

    const form = await Form.ModalForm({
      player: player,
      title: "§cReport a Member",
      options: [
        {
          type: "label",
          label:
            "§7Please make sure you have a clip, if you do not have a clip, your report will most likely be ignored!",
        },
        {
          type: "textfield",
          label: "§7Please enter the reason for the report below!",
          ghost: "Auto Clicking",
          tooltip: "Please be very specific!",
        },
      ],
    });

    if (!form.formValues) {
      player.sendError("Form closed.");
      return;
    }

    const reason = form.formValues[1] as string;
    const request = await API.Reports.Create({
      reason,
      source: player.id,
      target: target.entity_id,
    });

    switch (request.status) {
      case 200:
        player.sendSuccess("Successfully created report!");
        break;
      case 409:
        player.sendError(
          "You have already reported this member, or you are trying to report yourself!"
        );
        break;

      default:
        player.sendError("Failed to create report!");
    }
  }
}
