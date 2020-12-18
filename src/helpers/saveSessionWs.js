const fs = require("fs");
const path = require("path");

const configWs = require("../model/configWs");

module.exports = (session = {}) => {
  const filePath = path.join(__dirname, "../..", process.env.SESSION_FILE_PATH);

  fs.writeFile(filePath, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });

  configWs.session = session;
};
