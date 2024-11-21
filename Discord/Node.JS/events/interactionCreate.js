const client = require("../index");

client.on("interactionCreate", async (interaction) => {
  /* Modal Handling */
  if (interaction.isModalSubmit()) {
    
  }
  /* Command Handling */
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply({ content: "An error has occurred.", ephemeral: true});

    
  }
});
