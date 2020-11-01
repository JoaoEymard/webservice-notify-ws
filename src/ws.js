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

client.on("authenticated", (session) => {
  console.log(">>> Authenticated account");

  configWs.isAuthenticated = true;
  saveSessionWs(session);
});

client.on("message", async (msg) => {
  subscribe.emit("socketSendMessage", {
    ...msg,
    user: await msg.getContact(),
  });
});

subscribe.on("wsGetContact", async (fnCallBack) => {
  fnCallBack(await client.getContacts());
});
subscribe.on("wsSendMessage", async ({ chatId, content }, fnCallBack) => {
  const message = await client.sendMessage(chatId, content);
  fnCallBack(message);
});

client.initialize();
