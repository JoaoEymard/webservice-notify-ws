const fs = require("fs");
const path = require("path");

const configWs = {
  pathFileSession: path.join(__dirname, "../..", process.env.SESSION_FILE_PATH),
  isAuthenticated: false,
};

if (fs.existsSync(configWs.pathFileSession)) {
  configWs.session = require(configWs.pathFileSession);

  if (!configWs.session.WAToken1 || !configWs.session.WAToken2) {
    delete configWs.session;

    configWs.isAuthenticated = false;
  }
}

module.exports = configWs;
