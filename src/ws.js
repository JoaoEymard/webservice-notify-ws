const { Client } = require("whatsapp-web.js");
const crypto = require("crypto");

const subscribe = require("./subscribe");
const saveSessionWs = require("./helpers/saveSessionWs");
const generateQrCode = require("./helpers/generateQrCode");
const configWs = require("./model/configWs");

// Load the session data if it has been previously saved

let client = new Client({
  session: configWs.session,
  puppeteer: { args: ["--no-sandbox"] },
});

client.on("qr", async (qr) => {
  console.log(">>> Generated Qrcode: " + configWs.qtCodeGenerated);

  // Publishing new qrcode
  subscribe.emit("socketSendQr", await generateQrCode(qr));

  if (++configWs.qtCodeGenerated >= 5) {
    try {
      if (client.info) client.destroy();
    } catch (error) {
      console.error(error);
    }
  }
});

client.on("ready", () => {
  console.log(">>> Ready");
});

client.on("authenticated", (session) => {
  console.log(">>> Authenticated account");
  const token = crypto.randomBytes(64).toString("hex");

  saveSessionWs({ ...session, serverToken: token });

  configWs.isAuthenticated = true;
  subscribe.emit("socketSyncEvent", {
    type: "authenticated",
    isAuthenticated: true,
    token,
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
  client.logout();

  saveSessionWs();

  configWs.isAuthenticated = false;
  subscribe.emit("socketSyncEvent", {
    type: "disconnected",
    isAuthenticated: false,
  });

  subscribe.emit("wsInit");
});

// client.on("message", async (msg) => {
//   subscribe.emit("socketSendMessage", {
//     ...msg,
//     user: await msg.getContact(),
//   });
// });
// client.on("message_ack", async (msg) => {
//   subscribe.emit("socketSendMessage", {
//     ...msg,
//     user: await msg.getContact(),
//   });
// });

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
subscribe.on("wsLogout", async (fnCallBack) => {
  try {
    client.logout();

    saveSessionWs();

    configWs.isAuthenticated = false;
    subscribe.emit("socketSyncEvent", {
      type: "disconnected",
      isAuthenticated: false,
    });

    subscribe.emit("wsInit");
    fnCallBack();
  } catch (error) {
    fnCallBack(null, error);
  }
});

subscribe.on("wsInit", async () => {
  console.log(">>> Started");
  if (client.info) client.destroy();

  client.initialize();

  configWs.qtCodeGenerated = 0;
});
