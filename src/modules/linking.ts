import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";
import type Member from "../utils/wrappers/member";

export default class Linking {
  public static async View(member: Member): Promise<void> {
    const profile = Cache.Profiles.find(
      (profile) => profile.entity_id === member.EntityID()
    );

    if (!profile) {
      member.SendError(
        "Could not find your profile! Please reopen the form and try again."
      );
      return;
    }
    if (profile.discord_id) {
      member.SendError("You are already linked to a Discord account!");
      return;
    }

    const form = await Form.ModalForm({
      member,
      title: "§cAccount Linking",
      options: [
        {
          type: "textfield",
          label:
            "§7To get a code, please go to the discord, and run the §g/profile link§7 command to get your code.\n\nOnce you get your code, please enter it below!\n",
          ghost: "Code...",
        },
      ],
    });

    if (!form.formValues) {
      member.SendError("Form closed.");
      return;
    }

    const code = form.formValues[0] as string;

    if (code.length !== 6) {
      member.SendError("Invalid code!");
      return;
    }

    const request = await API.Linking.Use(code, member.EntityID());

    switch (request.status) {
      case 200:
        member.SendSuccess("Successfully linked your account!");
        break;
      case 404:
        member.SendError(
          "Could not find your profile! Please try rejoining the server."
        );
        break;
      case 406:
        member.SendError("Code not found!");
        break;
      case 409:
        member.SendError("You are already linked to a Discord account!");
        break;
    }
  }
}
