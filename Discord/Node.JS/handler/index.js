const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // Events HANDLER
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));
  // SO We need only to handler EVENTS cuz im a lil shit dev, forgot that hanlder was existing and to fucking lazy to recode the system command now, but the commands are now handled as events.
};