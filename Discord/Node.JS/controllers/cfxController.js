const axios = require("axios");


async function getServer(serverId) {
  return new Promise(async (resolve, reject) => {
    let headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
    };
    const api = `https://servers-frontend.fivem.net/api/servers/single/${serverId}`;
    try {
      const res = await axios.get(api, { headers: headers });
      if (res.status === 200 && !res.data.Data.error) {
        resolve({
          name: res.data.Data.hostname,
          online: true,
          playersOnline: `${res.data.Data.clients}/${res.data.Data.sv_maxclients}`,
        });
      } else {
        resolve({
          name: `Server ${serverId}`,
          online: false,
          playersOnline: "0/0",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        resolve({
          name: `Server ${serverId}`,
          online: false,
          playersOnline: "0/0",
        });
      } else {
        reject(`Error while fetching server data: ${error.message}`);
      }
    }
  });
}

async function getCfxStatus() {
  return new Promise(async (resolve, reject) => {
    let headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
    };
    const api = `https://status.cfx.re/api/v2/status.json`;
    const res = await axios.get(api, { headers: headers });
    if (res.status === 200) {
      resolve(res.data.status.description);
    } else {
      resolve("Unknown");
    }
  });
}

async function getStatusData(serverId) {
  return new Promise(async (resolve, reject) => {
    let server = await getServer(serverId);
    let cfxStatus = await getCfxStatus();
    resolve({
      serverName: server.name,
      online: server.online,
      playersOnline: server.playersOnline,
      cfxStatus: cfxStatus,
    });
  });
}


module.exports = {
  getStatusData,
};

