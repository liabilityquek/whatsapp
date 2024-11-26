const { Client, Location, Poll, List, Buttons, LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { setUpCronJob } = require('./cronJob'); // Import cron job logic
require('dotenv').config(); // Load environment variables

const phoneNumbers = (process.env.PHONE_NUMBERS || '').split(',');
const messages = JSON.parse(process.env.MESSAGE || '[]');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
    }
});

client.on('qr', (qr) => {
    console.log('Scan this QR code to login:');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Authenticated successfully');
});

client.on('ready', () => {
    console.log('WhatsApp is ready');

    // Schedule a cron job for each phone number
    phoneNumbers.forEach((number) => {
        const chatId = `${number.replace('+','')}@c.us`; // Fixed ID format
        setUpCronJob(client, chatId, messages); // Call the function from cronJobMonitoring.js
    });
});

client.on('auth_failure', (msg) => {
    console.error('Auth failure: ', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
    process.exit();
});

client.initialize();
