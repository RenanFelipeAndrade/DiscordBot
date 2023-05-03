import { useQueue } from "discord-player";
import { APIEmbedField, SlashCommandBuilder } from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, primaryEmbed } from "../components/embeds";

export const queue: Command = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Mostra a playlist atual"),
  run: async (interaction, _bot) => {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({
        embeds: [errorEmbed("Não foi possível obter informações do servidor")],
      });
      return;
    }

    const queue = useQueue(guild.id);
    if (!queue) {
      await interaction.reply({
        embeds: [errorEmbed("Não existe uma lista tocando agora")],
      });
      return;
    }

    const trackList = queue.tracks.toArray();

    const fields: APIEmbedField[] = trackList
      .slice(0, 10)
      .map((track, index) => {
        return {
          name: "\u200b", // zero-width space
          // title fomart (using markdown): position - `[duration]` **link-to-music-title**
          value: `${index + 1} - \`[${track.duration}]\` **[${track.title}](${
            track.url
          })**`,
        };
      });

    await interaction.reply({
      embeds: [primaryEmbed("Playlist atual").setFields(fields)],
    });
    return;
  },
};
