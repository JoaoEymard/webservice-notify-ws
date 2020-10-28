const { Client } = require("whatsapp-web.js");

const subscribe = require("./subscribe");
const saveSessionWs = require("./helpers/saveSessionWs");
const generateQrCode = require("./helpers/generateQrCode");
const configWs = require("./model/configWs");

// Load the session data if it has been previously saved

const client = new Client({ session: configWs.session });

client.on("qr", async (qr) => {
  console.log("gerando qr");
  // Publishing new qrcode
  subscribe.emit("socketSendQr", await generateQrCode(qr));
});

client.on("ready", () => {
  subscribe.emit("socketSendReady", true);
});

client.on("message", async (msg) => {
  console.log(msg, await client.getContactById(msg.id.id));

  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.on("message_create", (msg) => {
  console.log(msg);
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
  }
});

client.on("authenticated", (session) => {
  console.log("autenticado");

  configWs.isAuthenticated = true;
  saveSessionWs(session);
});

client.initialize();
