const Socket = require('socket.io');
const subscribe = require('./subscribe');

var socketId = '';

module.exports = (http) => {

  const io = Socket(http);

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socketId = socket.id;
    
    socket.on('disconnect', () => {
      socketId = '';
      console.log('user disconnected', socket.id);
    });
  });

  subscribe.on('socket-qr', (qr) => {
    io.to(socketId).emit('qr', qr)
  })

};
