import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, successEmbed } from "../components/embeds";

export const pause: Command = {
  data: new SlashCommandBuilder()
    .setName("pausar")
    .setDescription("Pausa a playlist"),
  run: async (interaction, _bot) => {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        embeds: [errorEmbed("Não foi possível obter informações do servidor")],
      });
      return;
    }

    const queue = useQueue(guild.id);
    if (!queue) {
      await interaction.reply({
        embeds: [errorEmbed("Não existe uma lista tocando agora")],
      });
      return;
    }

    queue.node.setPaused(!queue.node.isPaused());
    await interaction.reply({
      embeds: [successEmbed("A playlist foi pausada")],
    });

    return;
  },
};
