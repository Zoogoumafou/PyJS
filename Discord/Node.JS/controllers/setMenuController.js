const { sendMenuEmbed } = require("../controllers/embedController");
async function setMenu(interaction){
   interaction.followUp({content: "Menu en cours de création", ephemeral: true});
}

module.exports = {
    setMenu
}