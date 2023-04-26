import { EmbedBuilder } from "@discordjs/builders";
import { useQueue } from "discord-player";
import { APIEmbedField, SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";

export const queue: Command = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Mostra a playlist atual"),
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

    const trackList = queue.tracks.toArray();

    // component builder
    const fields: APIEmbedField[] = trackList
      .slice(0, 10)
      .map((track, index) => {
        return {
          name: "\u200b", // zero-width space
          // title fomart (using markdown): position - [duration] bold-link-to-music-title
          value: `${index + 1} - \`[${track.duration}]\` **[${track.title}](${
            track.url
          })**`,
        };
      });
    const message = new EmbedBuilder()
      .setTitle("Playlist atual")
      .addFields(fields);

    await interaction.reply({ embeds: [message] });
    return;
  },
};
