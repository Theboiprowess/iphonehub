const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRCode() {
  try {
    const websiteUrl = 'https://iphone-hub-masvingo.vercel.app';
    const outputPath = path.join(__dirname, 'public', 'qrcode.png');

    await QRCode.toFile(outputPath, websiteUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0E161B',
        light: '#CDB586',
      },
      errorCorrectionLevel: 'H',
    });

    console.log('QR code generated successfully at:', outputPath);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

generateQRCode();
