import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import Formatter from "../utils/formatter";
import TargetFinder from "../utils/targetFinder";
import type Member from "../utils/wrappers/member";
import World from "../utils/wrappers/world";

export default class Transfer {
  public static async View(member: Member): Promise<void> {
    const target = await TargetFinder.OfflineSearch(member);

    if (!target) {
      return;
    }
    if (target.entity_id === member.EntityID()) {
      member.SendError("You cannot transfer to yourself!");
      return;
    }

    const profile = Cache.Profiles.find(
      (profile) => profile.entity_id === member.EntityID()
    );
    const form = await Form.ModalForm({
      member,
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
      member.SendError("Form closed.");
      return;
    }

    const amount = parseInt(form.formValues[1] as string);

    if (isNaN(amount) || amount <= 0) {
      member.SendError("Please enter a valid number!");
      return;
    }

    const request = await API.Profiles.Transfer(member.EntityID(), {
      target: target.entity_id,
      amount,
    });
    const targetMember = World.FindMember(target.entity_id);

    switch (request.status) {
      case 200:
        member.SendSuccess(
          `Successfully transferred $${amount} to ${target.username}!`
        );

        if (targetMember) {
          targetMember.SendSuccess(
            `You have received $${amount} from ${member.Username()}!`
          );
        }
        break;
      case 402:
        member.SendError("You do not have enough money for this transfer!");
        break;
      case 409:
        member.SendError("You cannot transfer to yourself!");
        break;

      default:
        member.SendError("Failed to transfer money.");
    }
  }
}
