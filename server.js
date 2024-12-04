const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { getQRCode } = require('./index'); // Import QR code logic from index.js

app.get('/', (req, res) => {
    const qrCodeImageUrl = getQRCode();
    if (qrCodeImageUrl) {
        res.send(`
            <div style="text-align: center;">
                <h1>QR Code Image:</h1>
                <img src="${qrCodeImageUrl}" alt="QR Code Image" />
            </div>
        `);
    } else {
        res.send('<h1>QR image not available</h1>');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
