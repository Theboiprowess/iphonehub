import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationEmailProps {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  paymentReference?: string;
  items: Array<{
    name: string;
    storage: string;
    colour: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: string;
  deliveryAddress?: string;
  city?: string;
  paymentMethod: string;
  receivingAccountName?: string;
  receivingAccountNumber?: string;
}

interface AdminOrderNotificationProps {
  orderNumber: string;
  paymentReference?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  items: Array<{
    name: string;
    storage: string;
    colour: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  receivingAccountName?: string;
  receivingAccountNumber?: string;
  deliveryAddress?: string;
  city?: string;
  orderNotes?: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #0E161B;">${item.name}</div>
            <div style="font-size: 14px; color: #5F3C18;">${item.storage} • ${item.colour} × ${item.quantity}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #0E161B;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - iPhone Hub Masvingo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F5EF;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #0E161B; font-size: 32px; margin: 0 0 8px 0;">iPhone Hub Masvingo</h1>
              <p style="color: #5F3C18; font-size: 16px; margin: 0;">Order Confirmation</p>
            </div>

            <!-- Order Info -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <p style="color: #5F3C18; font-size: 16px; margin: 0 0 8px 0;">
                Thank you for your order, <strong>${data.customerName}</strong>!
              </p>
              <p style="color: #5F3C18; font-size: 14px; margin: 0 0 4px 0;">
                Your order <strong>${data.orderNumber}</strong> has been successfully placed.
              </p>
              ${data.paymentReference ? `<p style="color: #5F3C18; font-size: 14px; margin: 0;">
                Payment Reference: <strong>${data.paymentReference}</strong>
              </p>` : ''}
            </div>

            ${data.paymentMethod === 'ecocash' && data.receivingAccountName ? `
            <!-- EcoCash Payment Info -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">EcoCash Payment Instructions</h2>
              <div style="color: #5F3C18; font-size: 14px;">
                <p style="margin: 0 0 8px 0;"><strong>Send payment to:</strong></p>
                <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #0E161B;">${data.receivingAccountName}</p>
                <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #CDB586;">${data.receivingAccountNumber}</p>
                <p style="margin: 0 0 8px 0;"><strong>Amount:</strong> <span style="font-size: 18px; font-weight: 700;">$${data.total.toFixed(2)}</span></p>
                ${data.paymentReference ? `<p style="margin: 0;"><strong>Reference:</strong> ${data.paymentReference}</p>` : ''}
              </div>
            </div>
            ` : ''}

            <!-- Order Items -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>

            <!-- Order Summary -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Order Summary</h2>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #5F3C18;">
                <span>Subtotal</span>
                <span>$${data.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #5F3C18;">
                <span>Delivery (${data.deliveryMethod})</span>
                <span>${data.deliveryFee === 0 ? 'Free' : '$' + data.deliveryFee.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-weight: 700; font-size: 18px; color: #0E161B;">
                <span>Total</span>
                <span style="color: #CDB586;">$${data.total.toFixed(2)}</span>
              </div>
            </div>

            <!-- Delivery Info -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Delivery Information</h2>
              <div style="color: #5F3C18; font-size: 14px;">
                <p style="margin: 0 0 8px 0;"><strong>Method:</strong> <span style="text-transform: capitalize;">${data.deliveryMethod}</span></p>
                ${data.city ? `<p style="margin: 0 0 8px 0;"><strong>City:</strong> ${data.city}</p>` : ''}
                ${data.deliveryAddress ? `<p style="margin: 0;"><strong>Address:</strong> ${data.deliveryAddress}</p>` : ''}
              </div>
            </div>

            <!-- Payment Info -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Payment Information</h2>
              <div style="color: #5F3C18; font-size: 14px;">
                <p style="margin: 0;"><strong>Method:</strong> <span style="text-transform: capitalize;">${data.paymentMethod}</span></p>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #5F3C18; font-size: 14px; margin-top: 40px;">
              <p style="margin: 0 0 8px 0;">If you have any questions, please contact us:</p>
              <p style="margin: 0;">📱 WhatsApp: +263 77 322 7172</p>
              <p style="margin: 8px 0;">📧 Email: info@iphonehubmasvingo.co.zw</p>
              <p style="margin: 24px 0 0 0; font-size: 12px; color: #5F3C18;">iPhone Hub Masvingo • Masvingo, Zimbabwe</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'iPhone Hub Masvingo <orders@iphonehubmasvingo.co.zw>',
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('Order confirmation email sent:', emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send new order notification to admin
 */
export async function sendAdminOrderNotification(data: AdminOrderNotificationProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping admin email');
    return { success: false, error: 'Email not configured' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'iphonehub@gmail.com';

  try {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #0E161B;">${item.name}</div>
            <div style="font-size: 14px; color: #5F3C18;">${item.storage} • ${item.colour} × ${item.quantity}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #0E161B;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order - iPhone Hub Masvingo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F5EF;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #0E161B; font-size: 32px; margin: 0 0 8px 0;">iPhone Hub Masvingo</h1>
              <p style="color: #5F3C18; font-size: 16px; margin: 0;">New Order Received</p>
            </div>

            <!-- Order Info -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Order Details</h2>
              <div style="color: #5F3C18; font-size: 14px;">
                <p style="margin: 0 0 8px 0;"><strong>Order #:</strong> ${data.orderNumber}</p>
                ${data.paymentReference ? `<p style="margin: 0 0 8px 0;"><strong>Payment Reference:</strong> ${data.paymentReference}</p>` : ''}
                <p style="margin: 0 0 8px 0;"><strong>Total:</strong> <span style="color: #CDB586; font-weight: 700; font-size: 18px;">$${data.total.toFixed(2)}</span></p>
                <p style="margin: 0 0 8px 0;"><strong>Payment:</strong> <span style="text-transform: capitalize;">${data.paymentMethod}</span></p>
                ${data.paymentMethod === 'ecocash' && data.receivingAccountName ? `
                <p style="margin: 0 0 8px 0;"><strong>EcoCash Account:</strong> ${data.receivingAccountName}</p>
                <p style="margin: 0 0 8px 0;"><strong>EcoCash Number:</strong> ${data.receivingAccountNumber}</p>
                ` : ''}
                <p style="margin: 0;"><strong>Delivery:</strong> <span style="text-transform: capitalize;">${data.deliveryMethod}</span></p>
              </div>
            </div>

            <!-- Customer Info -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Customer Information</h2>
              <div style="color: #5F3C18; font-size: 14px;">
                <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${data.customerName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
                <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
                ${data.customerWhatsapp ? `<p style="margin: 0 0 8px 0;"><strong>WhatsApp:</strong> ${data.customerWhatsapp}</p>` : ''}
                ${data.city ? `<p style="margin: 0 0 8px 0;"><strong>City:</strong> ${data.city}</p>` : ''}
                ${data.deliveryAddress ? `<p style="margin: 0;"><strong>Address:</strong> ${data.deliveryAddress}</p>` : ''}
              </div>
            </div>

            <!-- Order Items -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
            </div>

            ${data.orderNotes ? `
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 18px; margin: 0 0 16px 0;">Order Notes</h2>
              <p style="color: #5F3C18; font-size: 14px; margin: 0;">${data.orderNotes}</p>
            </div>
            ` : ''}

            <!-- CTA -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.NEXTAUTH_URL}/admin/orders" style="display: inline-block; background-color: #CDB586; color: #0E161B; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                View Order in Admin
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #5F3C18; font-size: 14px; margin-top: 40px;">
              <p style="margin: 0;">iPhone Hub Masvingo Admin Dashboard</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'iPhone Hub Masvingo <noreply@iphonehubmasvingo.co.zw>',
      to: adminEmail,
      subject: `New Order - ${data.orderNumber}`,
      html,
    });

    if (error) {
      console.error('Admin email send error:', error);
      return { success: false, error };
    }

    console.log('Admin order notification sent:', emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
}
