const { CommandInteraction, Client } = require("@discordjs/builders");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Configure this channel to periodically display status updates'),
};
