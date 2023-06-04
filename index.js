const express = require('express')
const router = express.Router()
const app = express()

const bodyParser = require('body-parser');

const UserRoute = require('./routes/chats')

initRouters()

function initRouters() {
    const whatsappClient = initWhatsapp()
    new UserRoute(router, whatsappClient).initRoute()
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/api/v1', router)
    app.use('/api/v2', router)
    app.listen(3000, () => { console.log('Server is listening on port 3000') })
}

function initWhatsapp() {
    console.log(`Initializing whatsapp...`)
    const qrcode = require('qrcode-terminal');
    const { Client, LocalAuth } = require('whatsapp-web.js');
    const client = new Client({ authStrategy: new LocalAuth(), puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] } });
    global.client = client
    client.initialize();
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true }, (qrCode) => console.log('QR Value: ', qrCode));
        console.log('QR generated');
    });
    client.on('authenticated', (session) => { console.log('Client authenticated!'); });
    client.on('auth_failure', msg => { console.error('AUTHENTICATION FAILURE', msg); });
    client.on('ready', () => { console.log('READY') });
    client.on('message', msg => { console.log('MESSAGE RECEIVED', msg); });
    return client
}

module.exports = app;











