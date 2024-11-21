const client = require('../index')
const { pushSlashOnJoin } = require('../controllers/utils')
const { insertGuild } = require('../controllers/dataController')

client.on('guildCreate', async function (guild) {

  await pushSlashOnJoin(client, guild.id)
  insertGuild(guild.id) // Insert the guild into the database
 
})
