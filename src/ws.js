const axios = require('axios');
const subscribe = require('./subscribe');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', async (qr) => {
	// Generate and scan this code with your phone
	console.log('QR RECEIVED', qr);

	const { data } = await axios.post(`https://qr-generator.qrcode.studio/qr/custom`, {
		data: qr,
		size: 250,
		config: {
			body: 'circular', eye: 'frame13', eyeBall: 'ball15'
		},
		download: false,
		file: 'svg'
	});

	subscribe.emit('socket-qr', data);
});

client.on('ready', () => {
	console.log('Client is ready!');
	
	client.sendMessage('558896396886@c.us', 'teste auto!')
});

client.on('message', async msg => {
	console.log(msg, await client.getContactById(msg.id.id));
	
	if (msg.body == '!ping') {
		msg.reply('pong');
	}
});

client.on('message_create', (msg) => {
	console.log(msg);
	// Fired on all message creations, including your own
	if (msg.fromMe) {
		// do stuff here
	}
});

client.initialize();
