require('dotenv').config(); // Load environment variables
const { Client, Location, Poll, List, Buttons, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { setUpCronJob } = require('./cronJob'); // Import cron job logic
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const phoneNumbers = (process.env.PHONE_NUMBERS || '').split(',');
const messages = JSON.parse(process.env.MESSAGE || '[]');

let qrCodeImageUrl = null

puppeteer.use(StealthPlugin());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Ensure Puppeteer runs in a sandboxed environment
    }
});

client.on('qr', async (qr) => {
    try {
        console.log('Generating QR code...');
        qrCodeImageUrl = await qrcode.toDataURL(qr);
        console.log(`QR code URL generated successfully: ${qrCodeImageUrl}`); // Log the QR code URL to the consoleqrCodeImageUrl)
    } catch (err) {
        console.error(`Error generating QR code: ${err}`);
    }
});

client.on('authenticated', () => {
    console.log('Authenticated successfully');
    qrCodeImageUrl = null // Clear the QR code URL after authentication
});

client.on('ready', () => {
    console.log('WhatsApp is ready');

    // Schedule a cron job for each phone number
    phoneNumbers.forEach((number) => {
        const chatId = `${number.replace('+', '')}@c.us`; // Fixed ID format
        setUpCronJob(client, chatId, messages); // Call the function from cronJob.js
    });
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
    process.exit();
});

client.initialize();


module.exports = { getQRCode: () => qrCodeImageUrl };