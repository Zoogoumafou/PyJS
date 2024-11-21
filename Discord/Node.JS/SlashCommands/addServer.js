const { CommandInteraction, Client } = require("@discordjs/builders");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addserver')
    .setDescription('Displays the status of your server')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('Server ID to display status for')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('btn_label')
        .setDescription('Label for the additional button')
        .setRequired(false))
    .addStringOption(option =>
        option.setName('btn_url')
            .setDescription('URL for the additional button')
            .setRequired(false))
            .addBooleanOption(option =>
        option.setName('ticket')
            .setDescription('Adds a button to open a ticket')
            .setRequired(false)),
    
};
