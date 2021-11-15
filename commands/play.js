const {
  SlashCommandBuilder
} = require("@discordjs/builders")

const {
  Player
} = require("discord-player")

const {
  client
} = require("../index")

const {
  guildId
} = require("../config.json")

const player = new Player(client)

player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Agora tocando **${track.title}**!`))

module.exports = {
  data: new SlashCommandBuilder().setName("play").setDescription("Play a music").addStringOption(option =>
    option.setName('input')
    .setDescription('The input to echo back')
    .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.voice.channelId) return await interaction.reply({
      content: "Você não está conectado num canal",
      ephemeral: true
    });

    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({
      content: "Você não está no meu canal",
      ephemeral: true
    });

    const query = interaction.options.getString("input")
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.reply({
        content: "Could not join your voice channel!",
        ephemeral: true
      });
    }
    await interaction.deferReply();
    const track = await player.search(query, {
      requestedBy: interaction.user
    }).then(x => x.tracks[0]);
    if (!track) return await interaction.followUp({
      content: `❌ | **${query}** não foi encontrado!`
    });

    queue.play(track);

    const flemis = player.getQueue(guildId)
    console.log(flemis.previousTracks)
    return await interaction.followUp({
      content: `⏱️ | Carregando **${track.title}**!`
    });


  }
}