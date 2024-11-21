const client = require("../index");
const { Clear, isMemberHasAdminPrivilge } = require("../controllers/utils");
const { getStatusData } = require("../controllers/cfxController");
const {
  sendStatusEmbed,
  sendInitialEmbed,
} = require("../controllers/embedController");
const { setChannel, registerGuild, unRegisterGuild, addServer, removeServer, editServerDescription } = require("../controllers/settingController");
const { editServerDescriptionModal } = require("../controllers/modalsController");

client.on("interactionCreate", async (interaction) => {
  /* Modal Handling */
  if (interaction.isModalSubmit()) {
    switch (interaction.customId) {
      case "editServerDescriptionModal":
        await editServerDescription(interaction);
        break;
      default:
        console.log("Unknown modal");
        await interaction.reply({
          content: "Unknown modal.",
          ephemeral: true,
        });
        break;
    }
  }
  /* Command Handling */
  if (interaction.isCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply({ content: "An error has occurred.", ephemeral: true});

    switch (cmd.data.name) {
      case "setchannel":
        await interaction.deferReply({ ephemeral: true }).catch(() => {});
        if (!isMemberHasAdminPrivilge(interaction.member)) {
          await interaction.followUp({
            content:
              "You do not have permission to execute this command.",
            ephemeral: true,
          });
          return;
        }
        let channel_id = interaction.channel.id;
        let guild_id = interaction.guild.id;
        let data = { channel_id, guild_id };
        await setChannel(data);
        await interaction.followUp({
          content: `Channel <#${data.channel_id}> has been set as the channel for status display. Use /addserver to add a server.`,
          ephemeral: true,
        });
        break;

      case "addserver":
      if (!isMemberHasAdminPrivilge(interaction.member)) {
          await interaction.reply({
            content:
              "You do not have permission to execute this command.",
            ephemeral: true,
          });
          return;
        }
        addServer(interaction, await sendInitialEmbed(interaction, await getStatusData(interaction.options.getString("server"))));
        break;

      case "register":
        if (!isMemberHasAdminPrivilge(interaction.member)) {
          await interaction.reply({
            content:
              "You do not have permission to execute this command.",
            ephemeral: true,
          });
          return;
        }
        await registerGuild(interaction);
        break;

      case "unregister":
        if (!isMemberHasAdminPrivilge(interaction.member)) {
          await interaction.reply({
            content:
              "You do not have permission to execute this command.",
            ephemeral: true,
          });
          return;
        }
        await unRegisterGuild(interaction);
        break;

      case "status":
        sendStatusEmbed(
          interaction,
          await getStatusData(interaction.options.getString("server"))
        );
        break;
        case "removeserver":
        if (!isMemberHasAdminPrivilge(interaction.member)) {
          await interaction.reply({
            content:
              "You do not have permission to execute this command.",
            ephemeral: true,
          });
          return;
        }
        await removeServer(interaction);
        break;
        case "editdescription":
        if(!isMemberHasAdminPrivilge(interaction.member)){
          await interaction.reply({
            content: "You do not have permission to execute this command.",
            ephemeral: true,
          });
          return;
        }
        await editServerDescriptionModal(interaction);
        break
        default:
        console.log("Unknown command");
        await interaction.reply({
          content: "Unknown command.",
          ephemeral: true,
        });
        break;
    }
  }
});
