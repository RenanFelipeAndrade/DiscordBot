const data = require("../functions/fetchData")

module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(data)
    interaction.reply(`eae veja isso ${data.names}`)
  },
};