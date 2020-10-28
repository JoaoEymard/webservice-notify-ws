const Socket = require("socket.io");
const configWs = require("./model/configWs");
const subscribe = require("./subscribe");

var socketId = "";

module.exports = (http) => {
  const io = Socket(http);

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    socketId = socket.id;

    socket.emit("isAuthenticated", configWs.isAuthenticated);

    socket.on("disconnect", () => {
      socketId = "";
      console.log("user disconnected", socket.id);
    });
  });

  subscribe.on("socketSendQr", (content) => {
    io.to(socketId).emit("newQrCode", content);
  });
  subscribe.on("socketSendReady", (content) => {
    io.to(socketId).emit("qrCodeReady", content);
  });
};
