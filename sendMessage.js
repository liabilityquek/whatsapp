const { Client, LocalAuth } = require('whatsapp-web.js');
require('dotenv').config();
const phoneNumber = process.env.PHONE_NUMBER
const msgs = JSON.parse(process.env.MESSAGE)
// Initialize WhatsApp Web.js client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/persistent_storage/.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Ensure Puppeteer runs in a sandboxed environment
    },
});

// Function to send a WhatsApp message
async function sendMessage(chatId, message) {
    try {
        console.log(`Sending message: "${message}" to chatId: "${chatId}"`);
        await client.sendMessage(chatId, message);
        console.log('Message sent successfully.');
    } catch (error) {
        console.error(`Error sending message to ${chatId}: ${error.message}`);
    }
}

// When WhatsApp is ready, send messages and exit
client.on('ready', async () => {
    console.log('WhatsApp client is ready.');

    const chatId = `${phoneNumber.replace('+', '')}@c.us`
    const messages = msgs.map((msg)=> ({
        chatId, message: msg
    }))

    for (const { chatId, message } of messages) {
        await sendMessage(chatId, message);
        console.log(`Message sent to ${chatId}: "${message}"`);
    }
    console.log(`All messages have been sent. Exiting...`);
    process.exit(); // Exit after sending all messages
});

// Handle authentication events
client.on('authenticated', () => {
    console.log('Authenticated successfully.');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
    process.exit(1);
});

// Initialize the client
client.initialize();
