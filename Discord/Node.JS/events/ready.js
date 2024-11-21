const client = require("../index");
const { sendHelloWorld } = require("../controllers/embedController");
const { pushSlashCommand, refreshingCommandsForAserver, clearGlobalCommands, pushSlashCommandToGuild} = require("../controllers/utils");
const { send } = require("process");

/**  What i want to do here is
 * At every Lunch Remove every command of all server, then repush them, is the best way i found to make sur every body have the last updated command without delay.
 * Frist Del command
 * Second Push command
 * Then Overwrite command
 */
client.on("ready", async () => {
  
  client.user.setPresence({
    activities: [{ name: 'les stats fivem', type: 3 }], // Type 0 est pour Joue à
    status: 'online' // Vous pouvez choisir entre 'online', 'idle', 'dnd', ou 'invisible'
});

  console.log("client ready")


  const Guilds = client.guilds.cache.map((guild) => guild);
  var i = 0;
  clearGlobalCommands(client);
  Guilds.forEach(async (guild) => {
    console.log(client.user.username, ` is connected to the Discord. (${guild.name})`)
    pushSlashCommandToGuild(client, guild);
    i++;
  });
});
