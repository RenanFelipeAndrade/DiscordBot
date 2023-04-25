import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildQueue } from "discord-player";
import { TextBasedChannel } from "discord.js";
import { Command } from "../@types/Command";
import { player } from "../instances/player";

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

    await interaction.deferReply();

    let queueObj:
      | undefined
      | GuildQueue<{
          channel: TextBasedChannel | null;
        }> = undefined;

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

      interaction.followUp(`**${track.title}** colocado na lista`);
    } catch (e) {
      console.log(e);
      interaction.followUp(`Deu algo errado: ${e}`);
    }

    player.events.on("playerStart", (_queue, track) => {
      queueObj?.metadata?.channel?.send(`Rodando: **${track.title}**`);
    });
    return;
  },
};
