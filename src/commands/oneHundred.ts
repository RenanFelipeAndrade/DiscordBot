import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../@types/Command";

export const oneHundred: Command = {
  data: new SlashCommandBuilder()
    .setName("flemis")
    .setDescription("flemis")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message is flemis")
        .setRequired(true)
    ),
  run: async (interaction) => {
    const { user } = interaction;
    const text = interaction.options.get("message", true);
    console.log(text);
    interaction.reply(
      `O ${user.username} usou o comando ${interaction.commandName}, e mandou ${text.value}`
    );
  },
};
