import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const websiteUrl = 'https://iphonehubzimbabwe.co.zw';
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(websiteUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0E161B',
        light: '#CDB586',
      },
      errorCorrectionLevel: 'H',
    });

    // Return the QR code as a downloadable PNG
    const response = await fetch(qrCodeDataUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="iphone-hub-zimbabwe-qr.png"',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
