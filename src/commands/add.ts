import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { player } from "../instances/player";

export const add: Command = {
  data: new SlashCommandBuilder()
    .setName("adicionar")
    .setDescription("Adicione músicas ou playlists à playlist atual")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("link do Youtube/Spotify/etc")
        .setRequired(true)
    ),
  run: async (interaction, _bot) => {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply("Ocorreu um erro com o servidor");
      return;
    }

    const { user } = interaction;
    const member = guild.members.cache.get(user.id);
    if (!member) {
      await interaction.reply("O membro não está no servidor (não sei como)");
      return;
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply("Você não está em um canal de voz");
      return;
    }

    const response = interaction.options.get("link");
    if (!response) {
      interaction.reply("Não foi possível ler seu link");
      return;
    }

    const query = response.value;
    if (!query) {
      await interaction.reply("Insira um link");
      return;
    }

    const result = await player.search(query.toString());
    if (!result) {
      await interaction.reply("Não foi possível encontrar a música");
      return;
    }

    const queue = useQueue(guild.id);
    if (!queue) {
      await interaction.reply("Não há uma playlist no momento");
      return;
    }

    await interaction.deferReply();

    try {
      const track = result.tracks[0];
      queue.addTrack(track);
      await interaction.followUp(`**${track.title}** adicionada na playlist`);
    } catch (error) {
      console.log(error);
      await interaction.followUp(
        "Ocorreu um erro ao adicionar a música na lista"
      );
    }

    return;
  },
};
