const { MessageActionRow, MessageButton } = require("discord.js");
/** Modules */
const { time } = require("discord.js");
const {
  returnEmbed,
  returnDefaultImage,
  getOnLogChannel,
  updateMapBanMesageId,
  insertBillData,
} = require("./dataController");

/** Function embeds sender */

async function sendInitialEmbed(interaction, data) {
  let icon = interaction.guild.iconURL();
  let avatar = interaction.client.user.avatarURL();
  let thumbnail = interaction.guild.iconURL();
  let joinURL = `http://cfx.re/join/${interaction.options.getString("server")}`;
  let players = data.playersOnline;
  let cfx = data.cfxStatus;
  let online = data.online ? "🟢 Online" : "🔴 Offline";
  let name = data.serverName;
  let actionRow;

  const embed = {
    color: 0x7842f5,
    author: {
      name: name,
      icon_url: icon,
    },
    timestamp: new Date(),
    thumbnail: {
      url: thumbnail,
    },
    fields: [
      {
        name: "📊 Server",
        value: online,
        inline: false,
      },
      {
        name: "👩🏻‍💻 CFX",
        value: cfx,
        inline: false,
      },
      {
        name: "Players Online",
        value: `${players}`,
        inline: false,
      },
    ],
    footer: {
      text: interaction.guild.name,
      icon_url: avatar,
    },
  };

  const buttonPlay = {
    type: 2,
    style: 5,
    label: "🎮 Connect",
    url: joinURL,
  };

  const cfxStatus = {
    type: 2,
    style: 5,
    label: "📊 CFX Status",
    url: "https://status.cfx.re/",
  };

  if (
    interaction.options.getString("btn_label") &&
    interaction.options.getString("btn_url")
  ) {
    const buttonExtra = {
      type: 2,
      style: 5,
      label: interaction.options.getString("btn_label"),
      url: interaction.options.getString("btn_url"),
    };
    actionRow = {
      type: 1,
      components: [buttonPlay, buttonExtra, cfxStatus],
    };
  } else {
    actionRow = {
      type: 1,
      components: [buttonPlay, cfxStatus],
    };
  }

  let message_id;
  await interaction.channel
    .send({
      embeds: [embed],
      components: [actionRow],
    })
    .then((sent) => {
      message_id = sent.id;
    });

  return message_id;
}

async function sendStatusEmbed(interaction, data) {
  let icon = interaction.client.user.avatarURL();
  let avatar = interaction.client.user.avatarURL();
  let thumbnail = interaction.guild.iconURL();
  let joinURL = `http://cfx.re/join/${interaction.options.getString("server")}`;
  let players = data.playersOnline;
  let cfx = data.cfxStatus;
  let online = data.online ? "🟢 Online" : "🔴 Offline";
  let name = data.serverName;

  const embed = {
    color: 0x7842f5,
    author: {
      name: name,
      icon_url: icon,
    },
    timestamp: new Date(),
    thumbnail: {
      url: thumbnail,
    },
    fields: [
      {
        name: "📊 Server",
        value: online,
        inline: false,
      },
      {
        name: "👩🏻‍💻 CFX",
        value: cfx,
        inline: false,
      },
      {
        name: "Players Online",
        value: `${players}`,
        inline: false,
      },
    ],
    footer: {
      text: interaction.guild.name,
      icon_url: avatar,
    },
  };

  const buttonPlay = {
    type: 2,
    style: 5,
    label: "🎮 Connect",
    url: joinURL,
  };

  const cfxStatus = {
    type: 2,
    style: 5,
    label: "📊 CFX Status",
    url: "https://status.cfx.re/",
  };

  const actionRow = {
    type: 1,
    components: [buttonPlay, cfxStatus],
  };

  await interaction.reply({ embeds: [embed], components: [actionRow] });
}

async function returnEditedEmbed(client, guild, data, description) {
  let icon = guild.iconURL();
  let avatar = client.user.avatarURL();
  let thumbnail = guild.iconURL();
  return {
    color: 0x7842f5,
    author: {
      name: data.serverName,
      icon_url: icon,
    },
    description: description,
    timestamp: new Date(),
    thumbnail: {
      url: thumbnail,
    },
    fields: [
      {
        name: "📊 Server",
        value: data.online ? "🟢 Online" : "🔴 Offline",
        inline: false,
      },
      {
        name: "👩🏻‍💻 CFX",
        value: data.cfxStatus,
        inline: false,
      },
      {
        name: "Players Online",
        value: data.playersOnline,
        inline: false,
      },
    ],
    footer: {
      text: guild.name,
      icon_url: avatar,
    },
  };
}



/** Functions to export */
module.exports = {
  sendInitialEmbed,
  sendStatusEmbed,
  returnEditedEmbed,
};
