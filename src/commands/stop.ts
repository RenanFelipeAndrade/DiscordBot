import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { player } from "../instances/player";

export const stop: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Para de rodar as músicas"),
  run: async (interaction, _bot) => {
    const guildId = interaction.guild?.id;
    if (!guildId) {
      await interaction.reply("Não foi possível obter informações do servidor");
      return;
    }

    const queue = player.getQueue(guildId);
    if (!queue) {
      await interaction.reply("Não existe uma lista rodando agora");
      return;
    }

    try {
      queue.clear();
      await interaction.reply("A lista de música foi limpa!");
      queue.destroy(true);
    } catch (error) {
      console.log(error, "Error while clearing/destroying queue");
      await interaction.reply("Erro ao limpar a lista de música");
    }

    return;
  },
};
