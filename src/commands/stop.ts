import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, successEmbed } from "../components/embeds";
import { player } from "../instances/player";

export const stop: Command = {
  data: new SlashCommandBuilder()
    .setName("parar")
    .setDescription("Para de tocar as músicas e limpa a lista atual"),
  run: async (interaction, _bot) => {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        embeds: [errorEmbed("Não foi possível obter informações do servidor")],
      });
      return;
    }

    const queue = player.queues.get(guild);
    if (!queue) {
      await interaction.reply({
        embeds: [errorEmbed("Não existe uma lista tocando agora")],
      });
      return;
    }

    try {
      queue.delete();
      await interaction.reply({
        embeds: [successEmbed("A lista de música foi limpa!")],
      });
    } catch (error) {
      console.log(error, "Error while clearing/destroying queue");
      await interaction.reply({
        embeds: [errorEmbed("Erro ao limpar a lista de música")],
      });
    }

    return;
  },
};
