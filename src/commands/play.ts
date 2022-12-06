import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../@types/Command";
import { player } from "../instances/player";

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Toca música. CatJAM pá carai")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Youtube/Spotify/etc")
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

    const query = response.value!;
    const queue = player.createQueue(guild, {
      metadata: {
        channel: interaction.channel,
      },
      ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
      },
    });

    player.on("trackStart", () =>
      queue.metadata?.channel?.send(`🎶 | Now playing **${track.title}**!`)
    );

    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch (error) {
      queue.clear();
      queue.destroy(true);
      await interaction.reply("Não foi possível se conectar");
      return;
    }

    await interaction.deferReply();

    const track = await player
      .search(String(query), {
        requestedBy: interaction.user,
      })
      .then((result) => {
        const queryString = query.toString();
        const index = Number(queryString.split("index=")[1]) ?? 1;
        return result.tracks[index - 1];
      });

    if (!track) {
      await interaction.followUp({ content: `A música não foi encontrada!` });

      return;
    }

    queue.addTrack(track);
    await queue.play();

    await interaction.followUp({
      content: `Carregando **${track.title}**!`,
    });
    return;
  },
};
