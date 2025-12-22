import type { Player } from "@minecraft/server";
import API from "../utils/API/API";
import Cache from "../utils/cache";
import Form from "../utils/form/form";

export default class Linking {
  public static async View(player: Player): Promise<void> {
    const profile = Cache.Profiles.find(
      (profile) => profile.entity_id === player.id
    );

    if (!profile) {
      player.sendError(
        "Could not find your profile! Please reopen the form and try again."
      );
      return;
    }
    if (profile.discord_id) {
      player.sendError("You are already linked to a Discord account!");
      return;
    }

    const form = await Form.ModalForm({
      player: player,
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
      player.sendError("Form closed.");
      return;
    }

    const code = form.formValues[0] as string;

    if (code.length !== 6) {
      player.sendError("Invalid code!");
      return;
    }

    const request = await API.Linking.Use(code, player.id);

    switch (request.status) {
      case 200:
        player.sendSuccess("Successfully linked your account!");
        break;
      case 404:
        player.sendError(
          "Could not find your profile! Please try rejoining the server."
        );
        break;
      case 406:
        player.sendError("Code not found!");
        break;
      case 409:
        player.sendError("You are already linked to a Discord account!");
        break;
    }
  }
}
