import { useQueue } from "discord-player";
import {
  ButtonStyle,
  ComponentType,
  InteractionResponse,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../@types/Command";
import { errorEmbed, successEmbed } from "../components/embeds";
import { lyricsExtractor } from "@discord-player/extractor";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";

export const lyrics: Command = {
  data: new SlashCommandBuilder()
    .setName("letra")
    .setDescription("Mostra a letra da música atual"),
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

    const currentTrack = queue.currentTrack;
    if (!currentTrack) {
      await interaction.reply({
        embeds: [
          errorEmbed("Não foi possível obter informações da música atual"),
        ],
      });
      return;
    }

    const lyricsFinder = lyricsExtractor(process.env.GENIUS_ACCESS_TOKEN);
    const lyrics = await lyricsFinder
      .search(currentTrack.title.toString())
      .catch(() => null);

    if (!lyrics) {
      interaction.followUp({
        embeds: [errorEmbed("Não há letra disponível")],
      });
      return;
    }

    const trimmedLyrics = lyrics.lyrics.trim();
    const charLimit = 100;
    const numberOfSubStrings = Math.floor(trimmedLyrics.length / charLimit);

    const lyricsParts: string[] = [];
    let part = 0;
    for (let index = 0; index <= numberOfSubStrings; index++) {
      if (index < numberOfSubStrings)
        lyricsParts.push(
          trimmedLyrics.substring(index * charLimit, charLimit * (index + 1)) +
            "..."
        );
      else
        lyricsParts.push(
          trimmedLyrics.substring(index * charLimit, charLimit * (index + 1))
        );
    }

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel(">")
      .setStyle(ButtonStyle.Secondary);
    const previousButton = new ButtonBuilder()
      .setCustomId("previous")
      .setLabel("<")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      previousButton,
      nextButton
    );

    const embed = successEmbed(lyricsParts[part], lyrics.title)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setAuthor({
        name: lyrics.artist.name,
        iconURL: lyrics.artist.image,
        url: lyrics.artist.url,
      });

    if (numberOfSubStrings > 0) {
      const response: null | InteractionResponse = await interaction.reply({
        embeds: [embed],
        components: [row],
      });
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "previous" && part > 0) {
          part--;
        } else if (part < numberOfSubStrings) {
          part++;
        }
        const embed = successEmbed(lyricsParts[part], lyrics.title)
          .setURL(lyrics.url)
          .setThumbnail(lyrics.thumbnail)
          .setAuthor({
            name: lyrics.artist.name,
            iconURL: lyrics.artist.image,
            url: lyrics.artist.url,
          });
        if (response) {
          await i.deferReply();
          await interaction.editReply({ embeds: [embed], components: [row] });
        } else {
          await i.reply({ embeds: [embed], components: [row] });
          return;
        }
      });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
    return;
  },
};
