import type { Profile } from "../types/API";
import API from "./API/API";
import Form from "./form/form";
import type Member from "./wrappers/member";

export default class TargetFinder {
  public static async OfflineSearch(
    member: Member
  ): Promise<Profile | undefined> {
    const form = await Form.ModalForm({
      member,
      title: "§cOffline Search",
      options: [
        {
          type: "textfield",
          label: `§7Hello, §c§l${member.Username()}§r§7!\n\nPlease enter the member's name below!`,
          ghost: "Espryra",
          tooltip:
            "The member's username does not\nneed to be fully typed, nor CAP\nsensitive. Example: Esp",
        },
      ],
    });

    if (!form.formValues) {
      member.SendError("Form closed.");
      return;
    }

    const username = form.formValues[0] as string;
    const result = await API.Profiles.Search(username);

    if (!result.data) {
      member.SendError("Error searching for members!");
      return;
    }

    return this.Selector(member, result.data);
  }

  private static async Selector(
    member: Member,
    result: Profile[]
  ): Promise<Profile | undefined> {
    if (result.length === 0) {
      member.SendError(`Could not find any members with that search term!`);
      return;
    }

    const form = await Form.ActionForm({
      member,
      title: "§cOffline Search",
      body: `§7Hello, §c§l${member.Username()}§r§7!\n\nPlease select one of the §g${
        result.length
      }§7 results found below!`,
      buttons: result.map((member) => {
        return {
          text: member.username,
          subtext: "Click to Select",
          icon: "textures/ui/icon_steve",
        };
      }),
    });

    if (form.selection === undefined) {
      member.SendError("Form closed.");
      return;
    }

    return result[form.selection];
  }
}
