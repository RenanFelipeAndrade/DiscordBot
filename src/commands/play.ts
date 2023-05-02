import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import { Command } from "../@types/Command";
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
    const { reply, followUp, deferReply } = interaction;

    const errorEmbed = (message: string) =>
      new EmbedBuilder()
        .setTitle("Erro")
        .setColor(0xed4245)
        .setDescription(message);

    const defaultEmbed = (message: string, title?: string) => {
      const defaultEmbed = new EmbedBuilder()
        .setDescription(message)
        .setColor(0x4f545c);
      if (title) defaultEmbed.setTitle(title);
      return defaultEmbed;
    };

    const guild = interaction.guild;
    if (!guild) {
      await reply({
        embeds: [errorEmbed("Não foi possível ver informações do servidor")],
      });
      return;
    }

    const user = interaction.user;
    const member = guild.members.cache.get(user.id);
    if (!member) {
      await reply({
        embeds: [errorEmbed("Não foi possível ver informações do usuário")],
      });
      return;
    }

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await reply({
        embeds: [errorEmbed("Você não está no chat de voz")],
      });
      return;
    }

    const response = interaction.options.get("link");
    if (!response) {
      await reply({
        embeds: [errorEmbed("Não foi possível ler seu link")],
      });
      return;
    }

    const query = response.value;
    if (!query) {
      await reply({
        embeds: [errorEmbed("Insira um link!")],
      });
      return;
    }

    const queue = useQueue(guild.id);
    if (queue) {
      await reply({
        embeds: [
          errorEmbed(
            "Já há uma playlist tocando. Use `adicionar` para adicionar músicas à playlist"
          ),
        ],
      });
    }

    await deferReply();

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

      await followUp({
        embeds: [defaultEmbed(`**${track.title}** colocado na lista`)],
      });
    } catch (e) {
      console.log(e);
      await followUp({
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
