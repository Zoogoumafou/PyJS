const { glob } = require("glob");
const { promisify } = require("util");
const {
  Client,
  Collection,
  Intents,
  PermissionsBitField,
} = require("discord.js");
const fs = require("fs");
const globPromise = promisify(glob);
const fetchAll = require("discord-fetch-all");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("cfg-lib");
let conf = new config.Config("./config/config.cfg");
let token = conf.get("discord.token");
const rest = new REST({ version: "9" }).setToken(token);
// RESET COMMAND ALL SERVER

function isMemberIsEmployee(member) {
  const hasRole = member.roles.cache.some((role) => role.name === "Employés");
  if (hasRole) {
    return true;
  } else {
    return false;
  }
}

function isMemberHasAdminPrivilge(member) {
  if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    console.log("User has admin permissions: " + member.user.username);
    return true;
  } else {
    console.log(
      "User does not have admin permissions: " + member.user.username
    );
    return false;
  }
}

function isASlashCommand(messageOrReactionOrInteraction) {
  if (messageOrReactionOrInteraction.isCommand()) {
    return true;
  } else {
    return false;
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return string;
  } catch (err) {
    return `https://google.com/search?q=${string}`;
  }
}

function isEven(value) {
  return new Promise((resolve) => {
    if (value % 2 == 0) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
function switchBoolean(value) {
  if (value) {
    return false;
  } else {
    return true;
  }
}
// DUE TO THE DISCORD LIMITATION WE WILL PUSH COMMAND TO ALL DISCORD WITH THERE FUCNTION, AND USE THE CHECK UP WHEN THE COMMAND WILL BE EXECTUED.
async function pushSlashCommand(client) {
  //(async () => {
  //try {
  //console.log('Started refreshing application (/) commands globally.');

  // Supprime toutes les commandes globalement
  //await rest.put(
  //Routes.applicationCommands(client.user.id),
  //{ body: [] }, // Corps vide pour supprimer toutes les commandes
  //);

  //console.log('Successfully deleted all global application (/) commands.');
  //} catch (error) {
  //console.error(error);
  //}
  //})();

  //(async () => {
  //try {
  //console.log('Started refreshing application (/) commands for specific guild.');

  // Supprime toutes les commandes pour un serveur spécifique
  //await rest.put(
  //Routes.applicationGuildCommands(client.user.id, '1237085784150900746'),
  //{ body: [] }, // Corps vide pour supprimer toutes les commandes
  //);

  //console.log('Successfully deleted all application (/) commands for the guild.');
  //} catch (error) {
  //console.error(error);
  //}
  //})();

  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*.js`
  );

  client.slashCommands = new Collection();
  const commands = [];

  // Assurez-vous que cette partie charge les modules et non les chemins
  slashCommands.forEach((value) => {
    const commandFile = require(value);
    if (!commandFile?.data?.name) return;
    client.slashCommands.set(commandFile.data.name, commandFile);
    commands.push(commandFile.data);
  });

  // Déploiement global
  rest
    .put(Routes.applicationCommands(client.user.id), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);

  // Déploiement spécifique au serveur
  // await client.guilds.cache.get("1247670306177548308").commands.set(commands)
  //  .then(() => console.log('Successfully registered guild-specific commands.'))
  //  .catch(console.error);
}

async function pushSlashOnJoin(client, gid) {
  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*.js`
  );

  client.slashCommands = new Collection();
  const commands = [];

  // Assurez-vous que cette partie charge les modules et non les chemins
  slashCommands.forEach((value) => {
    console.log(value);
    const commandFile = require(value);
    if (!commandFile?.data?.name) return;
    client.slashCommands.set(commandFile.data.name, commandFile);
    commands.push(commandFile.data);
  });
  await client.guilds.cache
    .get(gid)
    .commands.set(commands)
    .then(() => console.log("Successfully registered guild-specific commands."))
    .catch(console.error);
}

//await client.guilds.cache
//.get("1237085784150900746")
//.commands.set(arrayOfSlashCommands); //Push to dev Server

//await client.commands.set(arrayOfSlashCommands); //Push to all

/**
 * Using This Method we should never bust the api limite.
 * */

async function clearGlobalCommands(client) {
  client.application.commands.set([]);
}

async function listMembersWithRole(activity) {
  let size = activity.options.data[0].role.members.size;
  if (size > 0) {
    let membersArray = [];
    for (let i = 0; i < size; i++) {
      membersArray.push(activity.options.data[0].role.members.at(i).user);
    }
    sendMembersFromRole(activity, membersArray);
  } else {
    return;
  }
}

async function Clear(activity) {
  //activity.followUp({ content: "Je commence le nettoyages du salon textuels." });
  const allMessages = await fetchAll.messages(activity.channel, {
    reverseArray: true, // Reverse the returned array
    userOnly: false, // Only return messages by users
    botOnly: false, // Only return messages by bots
    pinnedOnly: false, // Only returned pinned messages
  });
  allMessages.forEach((message) => {
    message
      .delete()
      .then((msg) => console.log(``))
      .catch(console.error);
  });
}

async function pushSlashCommandToGuild(client, guild) {
  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*.js`
  );

  client.slashCommands = new Collection();
  const commands = [];

  slashCommands.forEach((value) => {
    //console.log(value + " " + guild.name);
    const commandFile = require(value);
    if (!commandFile?.data?.name) return;
    client.slashCommands.set(commandFile.data.name, commandFile);
    commands.push(commandFile.data);
  });
  await client.guilds.cache
    .get(guild.id)
    .commands.set(commands)
    .then(() =>
      console.log(
        `Successfully registered guild-specific commands. ${guild.name}`
      )
    )
    .catch(console.error);
}

async function clearAllSlashCommandsFromGuild(client, guild) {
  (async () => {
    try {
      console.log(
        `Started delating application {/} commands for specific ${guild.name}.`
      );

      // Supprime toutes les commandes pour un serveur spécifique
      await guild.commands.set([]
      ).then(async () => {
        console.log(`Successfully deleted all application {/} commands for the ${guild.name}.`);        
        
      });
    } catch (error) {
      console.error(error);
    }
  })();
}
async function refreshingCommandsForAserver(client, guild) {
  await clearAllSlashCommandsFromGuild(client, guild).then((e) => {
  pushSlashCommandToGuild(client, guild);
  });
}

async function getDisordUserFromId(client, id) {
  return await client.users.fetch(id);
}

async function getGuildFromId(client, id) {
  return await client.guilds.fetch(id);
}

module.exports = {
  isEven,
  switchBoolean,
  pushSlashCommand,
  isASlashCommand,
  listMembersWithRole,
  Clear,
  isMemberHasAdminPrivilge,
  isMemberIsEmployee,
  getDisordUserFromId,
  isValidUrl,
  getGuildFromId,
  pushSlashOnJoin,
  refreshingCommandsForAserver,
  clearGlobalCommands,
  pushSlashCommandToGuild,
};
