import { useQueue } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, successEmbed } from "../components/embeds";
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
    const { reply, deferReply, followUp, user, guild } = interaction;
    if (!guild) {
      await reply({ embeds: [errorEmbed("Ocorreu um erro com o servidor")] });
      return;
    }

    const member = guild.members.cache.get(user.id);
    if (!member) {
      await reply({
        embeds: [errorEmbed("O membro não está no servidor (não sei como)")],
      });
      return;
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await reply({ embeds: [errorEmbed("Você não está em um canal de voz")] });
      return;
    }

    const response = interaction.options.get("link");
    if (!response) {
      reply({ embeds: [errorEmbed("Não foi possível ler seu link")] });
      return;
    }

    const query = response.value;
    if (!query) {
      await reply({ embeds: [errorEmbed("Insira um link")] });
      return;
    }

    const result = await player.search(query.toString());
    if (!result) {
      await reply({
        embeds: [errorEmbed("Não foi possível encontrar a música")],
      });
      return;
    }

    const queue = useQueue(guild.id);
    if (!queue) {
      await reply({ embeds: [errorEmbed("Não há uma playlist no momento")] });
      return;
    }

    await deferReply();

    try {
      const track = result.tracks[0];
      queue.addTrack(track);
      await followUp({
        embeds: [successEmbed(`**${track.title}** adicionada na playlist`)],
      });
    } catch (error) {
      console.log(error);
      await followUp({
        embeds: [errorEmbed("Ocorreu um erro ao adicionar a música na lista")],
      });
    }

    return;
  },
};
