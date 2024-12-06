// const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
require('dotenv').config()

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//     }
// })

// function sendEmail(subject, message) {
//     const mailOptions = {
//         from: process.env.SENDER_EMAIL,
//         to: process.env.RECEIVER_EMAIL,
//         subject,
//         text: message
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(`{Error sending email: ${error}}`)
//         } else {
//             console.log(`Email sent: ${info.response}`)
//         }
//     })
// }
async function sendMessage(client, chatId, message) {
    try {
        console.log(`Attempting to send message: "${message}" to chatId: "${chatId}"`);
        await client.sendMessage(chatId, message);
        console.log('Message sent successfully');
        // await sendEmail('Cron Job Success', 'Your scheduled message was sent successfully.');
    } catch (error) {
        console.error('Failed to send message:', error);
        // await sendEmail('Cron Job Failed', `Error: ${error.message}`);
    }
}

function setUpCronJob(client, chatId, messages) {

    const time = JSON.parse(process.env.TIME || '[]');
    if (time.lenght !== messages.lenght) {
        console.error('Error: TIME and MESSAGE arrays must have the same length.');
        return
    }

    time.forEach((t, index) => {
        const message = messages[index];
        if (typeof message !== 'string' || message.trim() === '') {
            console.error(`Invalid message at index: ${index}: ${message}`);
        }
        console.log(`Scheduling job for time: "${t}" and message: "${message}"`);
        schedule.scheduleJob(cronTime, async () => {
            console.log(`Cron job triggered at ${new Date().toLocaleString()} for message: "${message}"`);
            await sendMessage(client, chatId, message);
        });
    })
}

    // { time: '30 8 * * *', message: message[0] }, // 8:30 AM
    // { time: '45 11 * * *', message: message[1] }, // 11:45 AM
    // { time: '0 20 * * *', message: messages[2] },  // 8:00 PM


module.exports = {
    setUpCronJob
}