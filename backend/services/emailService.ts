import nodemailer from 'nodemailer';
import { EMAIL_BRAND } from '../constants/email';
import { buildCommonEmailFooter } from '../utils/emailTemplate';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // FIX: Use createTransport instead of createTransporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add these for Gmail specifically
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Test email configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: {
        name: EMAIL_BRAND.brandName,
        address: EMAIL_BRAND.fromEmail
      },
      to: to,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .button:hover { background: #5a67d8; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
              <div class="container">
                <div class="header">
                  <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                  <p>Dear Customer,</p>
                  <p>We received a request to reset the password for the account associated with this email address. If you did not request a password reset, no further action is required. Your account remains secure.</p>
                  <p>To reset your password, please click the link below:</p>
                  <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                  </div>
                  <p>If the button above does not work, copy and paste the following link into your browser:</p>
                  <p style="word-break: break-all; background: #f1f1f1; padding: 10px; border-radius: 3px;">
                    ${resetUrl}
                  </p>
                  <div class="warning">
                    <strong>Important:</strong> For security reasons, this link will expire in 10 minutes.
                  </div>
                  <p>If you require assistance, please contact our support team at <a href="mailto:${EMAIL_BRAND.supportEmail}">${EMAIL_BRAND.supportEmail}</a>.</p>
                </div>
                ${buildCommonEmailFooter()}
              </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully:', info.messageId);
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordChangeConfirmation(to: string): Promise<void> {
    const mailOptions = {
      from: {
        name: EMAIL_BRAND.brandName,
        address: EMAIL_BRAND.fromEmail
      },
      to: to,
      subject: 'Password Changed Successfully',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Password Changed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Changed Successfully</h1>
            </div>
            <div class="content">
              <p>Dear Customer,</p>
              <div class="success">
                <p><strong>Your password has been changed successfully.</strong></p>
              </div>
              <p>If you did not authorize this change, please contact our support team immediately at <a href="mailto:${EMAIL_BRAND.supportEmail}">${EMAIL_BRAND.supportEmail}</a>.</p>
              <p>For your account security, we recommend the following:</p>
              <ul>
                <li>Use a strong, unique password that you do not share with others.</li>
                <li>Enable multi-factor authentication if available.</li>
                <li>Contact support if you notice any suspicious activity on your account.</li>
              </ul>
            </div>
            ${buildCommonEmailFooter()}
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Password change confirmation email sent:', info.messageId);
    } catch (error) {
      console.error('❌ Failed to send confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }
  async sendContactFormEmail(name: string, email: string, subject: string, message: string): Promise<void> {
    const mailOptions = {
      from: {
        name: EMAIL_BRAND.brandName,
        address: EMAIL_BRAND.fromEmail
      },
      to: process.env.CONTACT_EMAIL || 'softzcart@gmail.com',
      subject: `New Contact Form: ${subject}`,
      replyTo: email,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: #555; margin-bottom: 5px; }
          .field-value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">From</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${email}</div>
            </div>
            <div class="field">
              <div class="field-label">Subject</div>
              <div class="field-value">${subject}</div>
            </div>
            <div class="field">
              <div class="field-label">Message</div>
              <div class="field-value">${message}</div>
            </div>
            <div class="field">
              <div class="field-label">Submitted At</div>
              <div class="field-value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          ${buildCommonEmailFooter({
        topNoteHtml: `This message was submitted via the contact form on <strong>${process.env.FROM_NAME || 'Softzcart'}</strong>.`,
      })}
        </div>
      </body>
      </html>
    `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contact form email sent successfully:', info.messageId);
    } catch (error) {
      console.error('❌ Failed to send contact form email:', error);
      throw new Error('Failed to send contact form email');
    }
  }

  async sendOrderConfirmationToAdmin(orderDetails: any): Promise<void> {
    const {
      orderId,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      items,
      subtotal,
      discount,
      totalAmount,
      paymentId
    } = orderDetails;

    // Format items list
    const itemsList = items.map((item: any, index: number) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${index + 1}</td>
        <td style="padding: 12px; text-align: left;">
          <strong>${item.name}</strong>
          ${item.version ? `<br><small style="color: #6b7280;">Version: ${item.version}</small>` : ''}
          ${item.pricingPlan ? `<br><small style="color: #6b7280;">Plan: ${item.pricingPlan}</small>` : ''}
          ${item.productId ? `<br><small style="color: #9ca3af;">Product ID: ${item.productId}</small>` : ''}
        </td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${Number(item.price).toFixed(2)}</td>
        <td style="padding: 12px; text-align: right;"><strong>₹${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong></td>
      </tr>
    `).join('');

    const mailOptions = {
      from: {
        name: EMAIL_BRAND.brandName,
        address: EMAIL_BRAND.fromEmail
      },
      to: process.env.CONTACT_EMAIL || 'softzcart@gmail.com',
      subject: `New Order Received - #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>New Order - ${orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; }
            .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 140px 1fr; gap: 10px; }
            .info-label { font-weight: bold; color: #6b7280; }
            .info-value { color: #1f2937; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #374151; }
            .summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .summary-row.total { font-size: 20px; font-weight: bold; color: #10b981; border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 8px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .badge-success { background: #d1fae5; color: #065f46; }
            .footer { text-align: center; padding: 20px; background: #f9fafb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Order Received</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderNumber}</p>
            </div>
            
            <div class="content">
              <!-- Order Info -->
              <div class="section">
                <div class="section-title">📦 Order Information</div>
                <div class="info-grid">
                  <div class="info-label">Order ID:</div>
                  <div class="info-value"><strong>${orderId}</strong></div>
                  
                  <div class="info-label">Order Number:</div>
                  <div class="info-value"><strong>#${orderNumber}</strong></div>
                  
                  <div class="info-label">Payment ID:</div>
                  <div class="info-value"><code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px;">${paymentId}</code></div>
                  
                  <div class="info-label">Status:</div>
                  <div class="info-value"><span class="badge badge-success">PAID</span></div>
                  
                  <div class="info-label">Order Date:</div>
                  <div class="info-value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                </div>
              </div>

              <!-- Customer Info -->
              <div class="section">
                <div class="section-title">👤 Customer Information</div>
                <div class="info-grid">
                  <div class="info-label">Name:</div>
                  <div class="info-value"><strong>${customerName}</strong></div>
                  
                  <div class="info-label">Phone:</div>
                  <div class="info-value">📱 <a href="tel:${customerPhone}">${customerPhone}</a></div>
                  
                  <div class="info-label">Email:</div>
                  <div class="info-value">📧 <a href="mailto:${customerEmail}">${customerEmail}</a></div>
                  
                  <div class="info-label">WhatsApp:</div>
                  <div class="info-value">
                    <a href="https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}" style="color: #25D366; text-decoration: none;">
                      💬 Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="section">
                <div class="section-title">🛒 Order Items</div>
                <table>
                  <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb;">
                      <th style="width: 50px;">#</th>
                      <th>Product</th>
                      <th style="width: 80px; text-align: center;">Qty</th>
                      <th style="width: 100px; text-align: right;">Price</th>
                      <th style="width: 120px; text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>

                <!-- Order Summary -->
                <div class="summary">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                  </div>
                  ${discount > 0 ? `
                  <div class="summary-row" style="color: #059669;">
                    <span>Discount:</span>
                    <span>-₹${discount.toFixed(2)}</span>
                  </div>
                  ` : ''}
                  <div class="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <!-- Action Required -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0; color: #92400e;">
                  <strong>Action Required:</strong> Please process this order and contact the customer to arrange delivery.
                </p>
              </div>
            </div>

            ${buildCommonEmailFooter({
        topNoteHtml: `Order received at <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>.`,
      })}
          </div>
        </body>
        </html>
      `
    };

    try {
      console.log('📧 Attempting to send order confirmation email...');
      console.log('📧 To:', process.env.CONTACT_EMAIL);
      console.log('📧 From:', process.env.FROM_EMAIL);
      console.log('📧 SMTP Host:', process.env.SMTP_HOST);

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Order confirmation email sent to admin:', info.messageId);
      console.log('✅ Email accepted by:', info.accepted);
    } catch (error: any) {
      console.error('❌ Failed to send order confirmation email:');
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('SMTP Response:', error.response);
      }
      throw new Error(`Failed to send order confirmation email: ${error.message}`);
    }
  }

  // Send welcome discount email to new lead
  async sendWelcomeDiscountEmail(
    to: string,
    name: string,
    discountCode: string,
    discountValue: number,
    validUntil: Date
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const validUntilFormatted = validUntil.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: {
        name: EMAIL_BRAND.brandName,
        address: EMAIL_BRAND.fromEmail
      },
      to: to,
      subject: `Welcome! Your ${discountValue}% Discount Code Inside`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Welcome Discount</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .coupon-box { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border: 2px dashed #667eea; padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0; }
            .coupon-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px; margin: 10px 0; font-family: 'Courier New', monospace; }
            .discount-badge { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 25px; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; font-size: 16px; }
            .button:hover { background: #5a67d8; }
            .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
            .highlight { color: #667eea; font-weight: bold; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${EMAIL_BRAND.brandName}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for joining us, ${name}!</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                <p>Hi <strong>${name}</strong>,</p>
              </div>
              
              <p>We're thrilled to have you with us! As a warm welcome, here's a special discount just for you.</p>
              
              <div class="coupon-box">
                <div class="discount-badge">
                  ${discountValue}% OFF
                </div>
                <p style="margin: 10px 0; font-size: 14px; color: #666;">Your Exclusive Discount Code:</p>
                <div class="coupon-code">${discountCode}</div>
                <p style="margin: 15px 0 0 0; font-size: 13px; color: #666;">
                  <em>Valid until ${validUntilFormatted}</em>
                </p>
              </div>

              <div class="info-box">
                <p style="margin: 0; font-size: 14px;">
                  <strong>How to use your code:</strong><br/>
                  1. Browse our amazing products<br/>
                  2. Add items to your cart<br/>
                  3. Enter code <strong>${discountCode}</strong> at checkout<br/>
                  4. Enjoy your ${discountValue}% discount!
                </p>
              </div>

              <p style="margin-top: 30px;">
                This is a <span class="highlight">one-time use code</span>, so make sure to use it wisely on your favorite products!
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${frontendUrl}" class="button">Start Shopping Now</a>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If you have any questions, feel free to reach out to us at 
                <a href="mailto:${EMAIL_BRAND.supportEmail}" style="color: #667eea;">${EMAIL_BRAND.supportEmail}</a>
              </p>

              <p style="margin-top: 20px;">
                Happy Shopping!<br/>
                <strong>The ${EMAIL_BRAND.brandName} Team</strong>
              </p>
            </div>

            ${buildCommonEmailFooter({
        topNoteHtml:
          "You're receiving this email because you signed up for our welcome discount.",
      })}
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome discount email sent successfully:', info.messageId);
    } catch (error) {
      console.error('❌ Failed to send welcome discount email:', error);
      throw new Error('Failed to send welcome discount email');
    }
  }
}

export default new EmailService();