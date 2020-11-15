const { Client } = require("whatsapp-web.js");

const subscribe = require("./subscribe");
const saveSessionWs = require("./helpers/saveSessionWs");
const generateQrCode = require("./helpers/generateQrCode");
const configWs = require("./model/configWs");

// Load the session data if it has been previously saved

const client = new Client({ session: configWs.session });

client.on("qr", async (qr) => {
  console.log(">>> Generated Qrcode");

  // Publishing new qrcode
  subscribe.emit("socketSendQr", await generateQrCode(qr));
});

client.on("ready", () => {
  console.log(">>> Ready");

  configWs.isAuthenticated = true;
  subscribe.emit("socketSyncEvent", {
    type: "ready",
    isAuthenticated: true,
  });
});

client.on("authenticated", (session) => {
  console.log(">>> Authenticated account");

  saveSessionWs(session);

  configWs.isAuthenticated = true;
  subscribe.emit("socketSyncEvent", {
    type: "authenticated",
    isAuthenticated: true,
  });
});

client.on("auth_failure", () => {
  console.log(">>> Authentication Failure");

  saveSessionWs();

  configWs.isAuthenticated = false;
  subscribe.emit("socketSyncEvent", {
    type: "auth_failure",
    isAuthenticated: false,
  });
});

client.on("disconnected", () => {
  console.log(">>> Disconnected");

  saveSessionWs();

  configWs.isAuthenticated = false;
  subscribe.emit("socketSyncEvent", {
    type: "disconnected",
    isAuthenticated: false,
  });
});

client.on("message", async (msg) => {
  subscribe.emit("socketSendMessage", {
    ...msg,
    user: await msg.getContact(),
  });
});
client.on("message_ack", async (msg) => {
  subscribe.emit("socketSendMessage", {
    ...msg,
    user: await msg.getContact(),
  });
});

subscribe.on("wsGetContact", async (fnCallBack) => {
  fnCallBack(await client.getContacts());
});
subscribe.on("wsGetChats", async (fnCallBack) => {
  fnCallBack(await client.getChats());
});
subscribe.on("wsSendMessage", async ({ chatId, content }, fnCallBack) => {
  try {
    const message = await client.sendMessage(chatId, content);
    fnCallBack(message);
  } catch (error) {
    fnCallBack(null, error);
  }
});

subscribe.on("wsInit", async () => {
  client.initialize();

  configWs.qtCodeGenerated = 0;
});
