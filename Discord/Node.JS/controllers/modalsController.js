const { Modal, TextInputComponent, showModal } = require("discord-modals");

async function editServerDescriptionModal(interaction) {
  if(!interaction.options.getString("server")) return interaction.reply({ content: "Please provide a server name.", ephemeral: true });
  if(interaction.options.getString("server").length != 6) return interaction.reply({ content: "The server name don't match the critaria.", ephemeral: true });
    const modal = new Modal()
    .setCustomId("editServerDescriptionModal")
    .setTitle(`${interaction.options.getString("server")} Edit Server Description`)
    .addComponents(
      new TextInputComponent()
        .setCustomId("cfx_id")
        .setLabel("CFX ID (6 characters)")
        .setStyle("SHORT") // ou 'LONG' pour le texte multiligne
        .setRequired(true)
        .setPlaceholder(`${interaction.options.getString("server")}`)
    )
    .addComponents(
      new TextInputComponent()
        .setCustomId("description")
        .setLabel("Description")
        .setStyle("LONG") // ou 'PARAGRAPH' pour le texte multiligne
        .setRequired(true)
        .setPlaceholder("Cool description")
    );

    await showModal(modal, {
    client: interaction.client, // Passer le client Discord
    interaction: interaction, // Passer l'interaction qui a déclenché l'affichage du modal
  });
}

module.exports = {
  editServerDescriptionModal,
};
