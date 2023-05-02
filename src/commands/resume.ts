import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, successEmbed } from "../components/embeds";

export const resume: Command = {
  data: new SlashCommandBuilder()
    .setName("retomar")
    .setDescription("Retoma a reprodução da playlist"),
  run: async (interaction, _bot) => {
    const { reply, guild } = interaction;
    if (!guild) {
      await reply({
        embeds: [errorEmbed("Não foi possível obter informações do servidor")],
      });
      return;
    }

    const queue = useQueue(guild.id);
    if (!queue) {
      await reply({
        embeds: [errorEmbed("Não existe uma lista tocando agora")],
      });
      return;
    }

    queue.node.resume();
    await reply({
      embeds: [successEmbed("A playlist foi retomada")],
    });

    return;
  },
};
