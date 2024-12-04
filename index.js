const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
require('dotenv').config();

let qrCodeImageUrl = null;

// Initialize WhatsApp Web.js client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Ensure Puppeteer runs in a sandboxed environment
    },
});

// Generate QR code when requested
client.on('qr', async (qr) => {
    try {
        console.log('Generating QR code...');
        qrCodeImageUrl = await qrcode.toDataURL(qr);
        console.log(`QR code generated successfully. QR code URL: ${qrCodeImageUrl}`);
    } catch (err) {
        console.error('Error generating QR code:', err);
    }
});

// Clear QR code after authentication
client.on('authenticated', () => {
    console.log('Authenticated successfully.');
    qrCodeImageUrl = null; // Clear the QR code after authentication
});

// Log when WhatsApp Web.js is ready
client.on('ready', () => {
    console.log('WhatsApp client is ready.');
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out:', reason);
    process.exit();
});

client.initialize()
