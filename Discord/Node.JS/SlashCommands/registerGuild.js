const { CommandInteraction, SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register the server to the HNS server list'),
};
