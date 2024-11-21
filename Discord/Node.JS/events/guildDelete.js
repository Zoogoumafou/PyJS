const { deleteGuild, deleteAllCfxsByGuild } = require("../controllers/dataController");
const client = require("../index")

client.on("guildDelete", function(guild){
    deleteGuild(guild.id)
    deleteAllCfxsByGuild(guild.id)
});
