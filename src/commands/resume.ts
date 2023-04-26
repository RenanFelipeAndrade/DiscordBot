import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";

export const resume: Command = {
  data: new SlashCommandBuilder()
    .setName("retomar")
    .setDescription("Retoma a reprodução da playlist"),
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

    queue.node.resume();
    await interaction.reply("A playlist foi retomada");

    return;
  },
};
