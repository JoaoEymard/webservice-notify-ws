const app = require('./src/app');
const http = require('http').createServer(app);

require('./src/socket')(http);

require('./src/ws');

// require('./ws')(io, socketId);

// client.on('qr', async (qr) => {
//   const { data } = await axios.post(`https://qr-generator.qrcode.studio/qr/custom`, {
//     data: qr,
//     size: 250,
//     config: {
//       body: 'circular', eye: 'frame13', eyeBall: 'ball15'
//     },
//     download: false,
//     file: 'svg'
//   });

//   io.to(socketId).emit('qr', data)
// })

http.listen(3000, () => {
  console.log('listening on *:3000');
  
  // client.initialize();
});