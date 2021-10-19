module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(`${interaction.user.tag} in triggered an interaction.`);
  },
};