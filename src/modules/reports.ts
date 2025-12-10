import API from "../utils/API/API";
import Form from "../utils/form/form";
import TargetFinder from "../utils/targetFinder";
import type Member from "../utils/wrappers/member";

export default class Reports {
  public static async Create(member: Member): Promise<void> {
    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }
    if (target.entity_id === member.EntityID()) {
      member.SendError("You cannot report yourself!");
      return;
    }

    const form = await Form.ModalForm({
      member,
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
      member.SendError("Form closed.");
      return;
    }

    const reason = form.formValues[1] as string;
    const request = await API.Reports.Create({
      reason,
      source: member.EntityID(),
      target: target.entity_id,
    });

    switch (request.status) {
      case 200:
        member.SendSuccess("Successfully created report!");
        break;
      case 409:
        member.SendError(
          "You have already reported this member, or you are trying to report yourself!"
        );
        break;

      default:
        member.SendError("Failed to create report!");
    }
  }
}
