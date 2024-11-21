/* Modules */
const config = require("cfg-lib");

var mysql = require("mysql");

let conf = new config.Config("./config/config.cfg");

var db_config;
/** Mysql Config */

db_config = {
  host: conf.get("login_dev.host"),
  user: conf.get("login_dev.user"),
  password: conf.get("login_dev.password"),
  database: conf.get("login_dev.database"),
};

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else {
      console.log(`\nMysql: Connection!\n`);
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "PROTOCOL_PACKETS_OUT_OF_ORDER"
    ) {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
async function insertCfx(data) {
  return new Promise((resolve, reject) => {
    var sql = `INSERT INTO cfx (cfx_id, guild_id, message_id, extra_btn_label, extra_btn_url) VALUES (?, ?, ?, ?, ?);`;
    connection.query(
      sql,
      [data.cfx_id, data.guild_id, data.message_id, data.extra_btn_label, data.extra_btn_url],
      function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function insertChannel(data) {
  return new Promise((resolve, reject) => {
    var sql = `INSERT INTO channels (channel_id, guild_id) VALUES (?, ?);`;
    connection.query(
      sql,
      [data.channel_id, data.guild_id],
      function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function getChannel(guild_id) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM channels WHERE guild_id = ?;`;
    connection.query(sql, [guild_id], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function getCfx(data) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cfx WHERE guild_id = ? AND cfx_id = ?;`;
    connection.query(sql, [data.guild_id, data.cfx_id], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function updateCfxDescription(data) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfx SET description = ? WHERE cfx_id = ? AND guild_id = ?;`;
    connection.query(sql, [data.description, data.cfx_id, data.guild_id], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

}

async function updateCfx(data) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE cfx 
      SET 
        message_id = ?,
        extra_btn_label = ?,
        extra_btn_url = ?
      WHERE 
        cfx_id = ? 
        AND guild_id = ?;
    `;
    connection.query(
      sql,
      [data.message_id, data.extra_btn_label, data.extra_btn_url, data.cfx_id, data.guild_id],
      function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function deleteCfx(data) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfx WHERE cfx_id = ? AND guild_id = ?;`;
    connection.query(sql, [data.cfx_id, data.guild_id], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
  
}

async function deleteAllCfxsByGuild(guild_id) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfx WHERE guild_id = ?;`;
    connection.query(sql, [guild_id], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

}

async function updateChannel(data) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE channels SET channel_id = ? WHERE guild_id = ?;`;
    connection.query(
      sql,
      [data.channel_id, data.guild_id],
      function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function getGuild(gid) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM guilds WHERE guild_id = ?;`;
    connection.query(sql, [gid], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function insertGuild(gid) {
  return new Promise((resolve, reject) => {
    var sql = `INSERT INTO guilds (guild_id) VALUES (?);`;
    connection.query(sql, [gid], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function deleteGuild(gid) {
  return new Promise((resolve, reject) => {
    var sql = `DELETE FROM guilds WHERE guild_id = ?;`;
    connection.query(sql, [gid], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function getGuilds() {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM guilds;`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

}

async function getCfxsByGuild(guild_id) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM cfx WHERE guild_id = ?;`;
    connection.query(sql, [guild_id], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

}

handleDisconnect();
/** Function  to exports */
module.exports = {
  insertCfx,
  insertChannel,
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
  deleteAllCfxsByGuild,
  updateCfxDescription
};
