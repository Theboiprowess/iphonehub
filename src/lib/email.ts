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

interface PaymentSuccessEmailProps {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  paymentDate: string;
}

/**
 * Send payment success email to customer
 */
export async function sendPaymentSuccessEmail(data: PaymentSuccessEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const paymentDate = new Date(data.paymentDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Successful - iPhone Hub Zimbabwe</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F5EF;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #0E161B; font-size: 32px; margin: 0 0 8px;">iPhone Hub Zimbabwe</h1>
              <p style="color: #5F3C18; font-size: 16px; margin: 0;">Premium iPhones. Exceptional Service.</p>
            </div>

            <!-- Success Message -->
            <div style="background: white; border-radius: 12px; padding: 32px; margin-bottom: 24px; border: 2px solid #CDB586;">
              <h2 style="color: #0E161B; font-size: 28px; margin: 0 0 16px; text-align: center;">Payment Successful! 🎉</h2>
              
              <p style="color: #5F3C18; font-size: 16px; margin: 0 0 8px;">
                Hi <strong>${data.customerName}</strong>,
              </p>
              
              <p style="color: #5F3C18; font-size: 16px; margin: 0 0 24px;">
                <strong>Your payment has been successfully received. Thank you for choosing iPhone Hub Zimbabwe!</strong>
              </p>
              
              <p style="color: #5F3C18; font-size: 16px; margin: 0 0 8px;">
                Your order is now <strong>officially confirmed</strong>, and our team will begin preparing it for you.
              </p>
            </div>

            <!-- Order Confirmed -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h3 style="color: #0E161B; font-size: 20px; margin: 0 0 16px;">🛍️ Order Confirmed</h3>
              
              <div style="color: #5F3C18; font-size: 14px; line-height: 2;">
                <p style="margin: 0;"><strong>Order Number:</strong> #${data.orderNumber}</p>
                <p style="margin: 0;"><strong>Payment Status:</strong> ✅ PAID</p>
                <p style="margin: 0;"><strong>Payment Amount:</strong> $${data.orderTotal.toFixed(2)}</p>
                <p style="margin: 0;"><strong>Payment Date:</strong> ${paymentDate}</p>
              </div>
            </div>

            <!-- What Happens Now -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #CDB586;">
              <h3 style="color: #0E161B; font-size: 20px; margin: 0 0 16px;">📱 What Happens Now?</h3>
              
              <p style="color: #5F3C18; font-size: 16px; margin: 0 0 16px;">
                Your order is now being processed by our team. We'll carefully prepare your iPhone and keep you updated as it moves through the next stages.
              </p>
              
              <div style="color: #5F3C18; font-size: 16px; line-height: 2;">
                <p style="margin: 0;">✅ <strong>Payment Received</strong></p>
                <p style="margin: 0;">✅ <strong>Order Confirmed</strong></p>
                <p style="margin: 0;">⏳ <strong>Preparing Your Order</strong></p>
                <p style="margin: 0;">🚚 <strong>Delivery To Follow</strong></p>
              </div>
              
              <p style="color: #5F3C18; font-size: 16px; margin: 24px 0 0; font-style: italic;">
                You don't need to do anything right now. <strong>We'll contact you when your order is ready for delivery or collection.</strong>
              </p>
            </div>

            <!-- Thank You -->
            <div style="background: #0E161B; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #EBE2C5; font-size: 20px; margin: 0 0 16px;">Thank You for Trusting Us</h3>
              
              <p style="color: #EBE2C5; font-size: 16px; margin: 0 0 16px;">
                At <strong>iPhone Hub Zimbabwe</strong>, we don't just sell iPhones — we want every customer to feel confident from the moment they place an order until their iPhone is safely in their hands.
              </p>
              
              <p style="color: #CDB586; font-size: 16px; margin: 0 0 16px; font-weight: 600;">
                <strong>Based in Masvingo • Serving Customers Nationwide</strong>
              </p>
              
              <p style="color: #EBE2C5; font-size: 16px; margin: 0;">
                If you have any questions about your order, our team is always ready to assist.
              </p>
              
              <p style="color: #EBE2C5; font-size: 16px; margin: 24px 0 0; font-style: italic;">
                Thank you for choosing iPhone Hub Zimbabwe.
              </p>
              
              <p style="color: #CDB586; font-size: 18px; margin: 0 0 8px; font-weight: 600;">
                Your new iPhone journey starts now. 🍎
              </p>
              
              <p style="color: #EBE2C5; font-size: 16px; margin: 8px 0 0;">
                Warm regards,<br>
                <strong>iPhone Hub Zimbabwe</strong><br>
                <span style="color: #CDB586;">Premium iPhones. Exceptional Service.</span>
              </p>
              
              <p style="color: #EBE2C5; font-size: 14px; margin: 24px 0 0;">
                📍 Masvingo, Zimbabwe<br>
                Serving Customers Nationwide
              </p>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; color: #5F3C18; font-size: 14px; margin-top: 40px;">
              <p style="margin: 0 0 8px;">If you have any questions, please contact us:</p>
              <p style="margin: 0;">📱 WhatsApp: +263 77 322 7172</p>
              <p style="margin: 8px 0;">📧 Email: info@iphonehubmasvingo.co.zw</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'iPhone Hub Zimbabwe <orders@iphonehubzimbabwe.co.zw>',
      to: data.customerEmail,
      subject: `Payment Successful - Order #${data.orderNumber}`,
      html,
    });

    if (error) {
      console.error('Payment success email send error:', error);
      return { success: false, error };
    }

    console.log('Payment success email sent:', emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Failed to send payment success email:', error);
    return { success: false, error };
  }
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
      from: 'iPhone Hub Zimbabwe <orders@iphonehubzimbabwe.co.zw>',
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

  const adminEmail = process.env.ADMIN_EMAIL || 'iphonehubzimbabwe@gmail.com';

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
      from: 'iPhone Hub Zimbabwe <noreply@iphonehubzimbabwe.co.zw>',
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
