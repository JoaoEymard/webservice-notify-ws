const fs = require("fs");
const path = require("path");

const configWs = {
  pathFileSession: path.join(__dirname, "../..", process.env.SESSION_FILE_PATH),
  isAuthenticated: false,
};

if (fs.existsSync(configWs.pathFileSession)) {
  configWs.session = require(configWs.pathFileSession);
}

module.exports = configWs;
