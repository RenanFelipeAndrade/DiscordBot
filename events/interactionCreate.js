// const data = require("../functions/fetchData")

const fs = require('fs')


module.exports = {
  name: 'interactionCreate',
  execute(interaction) {

    if (!interaction.isCommand()) return

    const {
      commandName
    } = interaction

    const command = require(`../commands/${commandName}`)

    command.execute(interaction)

    // interaction.reply(`eae veja isso ${data.names}`)
  },
};