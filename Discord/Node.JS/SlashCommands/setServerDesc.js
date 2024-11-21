const { CommandInteraction, Client } = require("@discordjs/builders");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('editdescription')
    .setDescription('Edit the description of your server, will be displayed in the embed at the next update.')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('Server ID to edit description for')
        .setRequired(true)),
};
