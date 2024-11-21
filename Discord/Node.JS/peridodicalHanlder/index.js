const { Client } = require("discord.js");
const { periodicalCheck } = require("../controllers/settingController");

/**
 * @param {Client} client
 */
const intervalTime = 1 * 60 * 1000;
module.exports = async (client) => {
    setInterval(async () => {
        try {
            await periodicalCheck(client);
        } catch (error) {
            
        }
    }, intervalTime);
}