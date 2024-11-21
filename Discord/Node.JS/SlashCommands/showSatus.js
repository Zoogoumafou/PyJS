const { CommandInteraction, Client } = require("@discordjs/builders");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Displays the status of your server')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('Server ID to display status')
        .setRequired(true)),
};
