const { CommandInteraction, Client } = require("@discordjs/builders");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeserver')
    .setDescription('Remove the server from the HNS server list')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('ID of the server to remove from the list')
        .setRequired(true)),
    
};