const PingManager = require("./PingManager.js");

let manager = new PingManager();

(async function() {
    await manager.scanAllSites();
})();