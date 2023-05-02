import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";

export const pause: Command = {
  data: new SlashCommandBuilder()
    .setName("pausar")
    .setDescription("Pausa a playlist"),
  run: async (interaction, _bot) => {
    const guildId = interaction.guild?.id;
    if (!guildId) {
      await interaction.reply("Não foi possível obter informações do servidor");
      return;
    }

    const queue = useQueue(guildId);
    if (!queue) {
      await interaction.reply("Não existe uma lista tocando agora");
      return;
    }

    queue.node.setPaused(!queue.node.isPaused());
    await interaction.reply("A playlist foi pausada");

    return;
  },
};
