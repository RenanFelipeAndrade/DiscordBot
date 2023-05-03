import { useHistory, useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, successEmbed } from "../components/embeds";

export const previous: Command = {
  data: new SlashCommandBuilder()
    .setName("anterior")
    .setDescription("Retorna para a musica anterior"),
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
        embeds: [errorEmbed("Não existe uma playlist tocando agora")],
      });
      return;
    }

    const history = useHistory(guild.id);
    if (!history) {
      await interaction.reply({
        embeds: [
          errorEmbed("Não foi possível obter a(s) música(s) anterior(es)"),
        ],
      });
      return;
    }

    await history.previous();

    await interaction.reply({
      embeds: [successEmbed("Retornei para a anterior")],
    });

    return;
  },
};
