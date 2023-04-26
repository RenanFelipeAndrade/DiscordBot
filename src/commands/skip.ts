import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";

export const skip: Command = {
  data: new SlashCommandBuilder()
    .setName("proxima")
    .setDescription("Passa para a próxima música"),
  run: async (interaction, _bot) => {
    const guildId = interaction.guild?.id;
    if (!guildId) {
      await interaction.reply("Não foi possível obter informações do servidor");
      return;
    }

    const queue = useQueue(guildId);
    if (!queue) {
      await interaction.reply("Não existe uma lista rodando agora");
      return;
    }

    queue.node.skip();
    await interaction.reply("Passei para a próxima");

    return;
  },
};
