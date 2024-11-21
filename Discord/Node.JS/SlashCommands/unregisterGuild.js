const { CommandInteraction, Client } = require("@discordjs/builders");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('unregister')
    .setDescription('Unregister the server from the HNS server list'),
    
};