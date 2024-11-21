const {
  insertChannel,
  insertCfx,
  getGuild,
  insertGuild,
  deleteGuild,
  getCfx,
  updateCfx,
  getChannel,
  updateChannel,
  getGuilds,
  getCfxsByGuild,
  deleteCfx,
  updateCfxDescription,
} = require("./dataController");
const { getStatusData } = require("./cfxController");
const { returnEditedEmbed } = require("./embedController");
const { isValidUrl } = require("./utils");
const { editServerDescriptionModal } = require("./modalsController");

async function registerGuild(interaction) {
  const res = await getGuild(interaction.guild.id);
  if (res.length !== 0) {
    interaction.reply({
      content: `Server already registered on HNS services. Premium Status: ${res[0].premium}`,
      ephemeral: true,
    });
  } else {
    await insertGuild(interaction.guild.id);
    interaction.reply({
      content: "Server has been registered on HNS services.",
      ephemeral: true,
    });
  }
}

async function unRegisterGuild(interaction) {
  const res = await getGuild(interaction.guildId);
  if (res.length === 0) {
    interaction.reply({
      content: "Server is not registered on HNS services.",
      ephemeral: true,
    });
  } else {
    await deleteGuild(interaction.guildId);
    interaction.reply({
      content: "Server has been unregistered from HNS services.",
      ephemeral: true,
    });
  }
}

async function setChannel(data) {
  const res = await getChannel(data.guild_id);
  if (res.length !== 0) {
    await updateChannel(data);
  } else {
    await insertChannel(data);
  }
}

async function addServer(interaction, msg) {
  const data = {
    cfx_id: interaction.options.getString("server"),
    guild_id: interaction.guildId,
    message_id: msg,
  };

  const btnLabel = interaction.options.getString("btn_label");
  const btnUrl = interaction.options.getString("btn_url");
  if (btnLabel && btnUrl) {
    data.extra_btn_label = btnLabel;
    data.extra_btn_url = isValidUrl(btnUrl);
  } else {
    data.extra_btn_label = null;
    data.extra_btn_url = null;
  }

  if (interaction.options.getBoolean("ticket")) {
    interaction.reply({
      content:
        "Server addition completed 🎉. You do not have the premium plan to use tickets. 🚫",
      ephemeral: true,
    });
  } else {
    interaction.reply({
      content: "Server addition completed 🎉",
      ephemeral: true,
    });
  }

  const res = await getCfx(data);
  if (res.length !== 0) {
    await updateCfx(data);
  } else {
    await insertCfx(data);
  }
}

async function periodicalCheck(client) {
  let guilds = await getGuilds();
  let Guild;
  let Channel;
  let description;
  guilds.forEach(async (guild) => {
    let channelId = await getChannel(guild.guild_id);
    if (channelId.length === 0) {
      return;
    }
    try {
      Guild = await client.guilds.fetch(guild.guild_id);
    } catch (e) {
      return;
    }
    try {
      Channel = await Guild.channels.fetch(channelId[0].channel_id);
    } catch (e) { 
      return;
    }
    let cfxs = await getCfxsByGuild(guild.guild_id);
    cfxs.forEach(async (cfx) => {
      if (!cfx.message_id) {
        return;
      }
      let Message
      try {
        Message = await Channel.messages.fetch(cfx.message_id);
      
      } catch (e) {
        return
      }
      description = cfx.description ? cfx.description : "";
      Message.edit({
        embeds:[await returnEditedEmbed(
          client,
          Guild,
          await getStatusData(cfx.cfx_id), 
          description
        )],
      });
    });
  });
}

async function editServerDescription(interaction) {
  const data = { 
    cfx_id: interaction.fields.getTextInputValue('cfx_id'),
    guild_id: interaction.guildId,
    description: interaction.fields.getTextInputValue('description'),
  };

  const res = await getCfx(data);
  if (res.length === 0) {
    interaction.reply({
      content: "Server not found in the database.",
      ephemeral: true,
    });
  } else {
    await updateCfxDescription(data);
    interaction.reply({
      content: "Server description has been updated.",
      ephemeral: true,
    });
  }
}

async function removeServer(interaction) {
    const data = {
        cfx_id: interaction.options.getString("server"),
        guild_id: interaction.guildId,
    };
    const res = await getCfx(data);
    if (res.length === 0) {
        interaction.followup({
        content: "Server not found in the database.",
        ephemeral: true,
        });
    } else {
        await deleteCfx(data);
        interaction.followup({
        content: "Server has been removed from HNS services.",
        ephemeral: true,
        });
    }
}

module.exports = {
  setChannel,
  addServer,
  registerGuild,
  unRegisterGuild,
  periodicalCheck,
  removeServer,
  editServerDescription
};
