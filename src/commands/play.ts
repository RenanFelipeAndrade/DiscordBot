import { SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import { Command } from "../@types/Command";
import { defaultEmbed, errorEmbed, successEmbed } from "../components/embeds";
import { player } from "../instances/player";

interface Queue {
  metadata: {
    channel: TextBasedChannel | null;
  };
}

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Toca música. CatJAM pá carai")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("link do Youtube/Spotify/etc")
        .setRequired(true)
    ),
  run: async (interaction, _bot) => {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        embeds: [errorEmbed("Não foi possível ver informações do servidor")],
      });
      return;
    }

    const user = interaction.user;
    const member = guild.members.cache.get(user.id);
    if (!member) {
      await interaction.reply({
        embeds: [errorEmbed("Não foi possível ver informações do usuário")],
      });
      return;
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply({
        embeds: [errorEmbed("Você não está no chat de voz")],
      });
      return;
    }

    const response = interaction.options.get("link");
    if (!response) {
      await interaction.reply({
        embeds: [errorEmbed("Não foi possível ler seu link")],
      });
      return;
    }

    const query = response.value;
    if (!query) {
      await interaction.reply({
        embeds: [errorEmbed("Insira um link!")],
      });
      return;
    }

    const queue = useQueue(guild.id);
    if (queue) {
      await interaction.reply({
        embeds: [
          errorEmbed(
            "Já há uma playlist tocando. Use `adicionar` para adicionar músicas à playlist"
          ),
        ],
      });
      return;
    }

    // if deferReply function is deconstruct
    // an error is thrown
    // TypeError: Cannot read properties of undefined (reading 'deferred')
    await interaction.deferReply();

    let queueObj: undefined | Queue = undefined;

    try {
      const { track, queue } = await player.play(
        voiceChannel,
        query.toString(),
        {
          nodeOptions: {
            metadata: {
              channel: interaction.channel,
            },
          },
        }
      );

      queueObj = queue;

      await interaction.followUp({
        embeds: [successEmbed(`**${track.title}** colocado na lista`)],
      });
    } catch (e) {
      console.log(e);
      await interaction.followUp({
        embeds: [errorEmbed(`Algo deu errado: ${e}`)],
      });
    }

    player.events.on("playerStart", (_queue, track) => {
      queueObj?.metadata?.channel?.send({
        embeds: [defaultEmbed(`Tocando: **${track.title}**`)],
      });
    });
    return;
  },
};
