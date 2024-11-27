// const nodemailer = require('nodemailer')
const schedule = require('node-schedule')

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
    const schedules = [
        // { time: '*/1 * * * *', message: messages[0] },
        // { time: '*/2 * * * *', message: messages[1] },
        // { time: '*/3 * * * *', message: messages[2] },
        { time: '30 8 * * *', message: message[0] }, // 8:30 AM
        { time: '45 11 * * *', message: message[1] }, // 11:45 AM
        { time: '0 20 * * *', message: messages[2] },  // 8:00 PM
    ];

    schedules.forEach((scheduleItem, index) => {
        console.log(`Schedule ${index}: Time - ${scheduleItem.time}, Message - "${scheduleItem.message}"`);

        schedule.scheduleJob(scheduleItem.time, async () => {
            console.log(`Cron job started at ${new Date().toLocaleString()}`);
            console.log(`Message to send: "${scheduleItem.message}"`);

            // Validate the message
            if (typeof scheduleItem.message !== 'string' || scheduleItem.message.trim() === '') {
                console.error(`Invalid message: "${scheduleItem.message}"`);
                return;
            }
            // schedule.scheduleJob('*/5 * * * * *', () => {
            //     console.log(`Cron job started at ${new Date().toLocaleString()}`);
            //     sendEmail('Cron Job Started', `Your scheduled job has started at ${new Date().toLocaleString()}.`);
            // });
            await sendMessage(client, chatId, scheduleItem.message);
        });
    });
}
module.exports = {
    setUpCronJob
}