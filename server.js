const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const { getQRCode } = require('./index')

app.get('/', (req, res) => {
    const qrCodeImageUrl = getQRCode()
    if (qrCodeImageUrl) {
        res.send(
            <div style="text-align: center;">
                <h1>Scan the QR Code</h1>
                <img src="${qrCodeImageUrl}" alt="QR Code" />
            </div>
        )
    } else {
        res.send('<h1>No QR Code Available</h1>')
    }
})

app.get('/', (req, res) => {
    res.send('WhatsApp automation service is running.');
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})