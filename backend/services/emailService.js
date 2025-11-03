"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        // FIX: Use createTransport instead of createTransporter
        this.transporter = nodemailer_1.default.createTransport({
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
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service connected successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Email service connection failed:', error);
            return false;
        }
    }
    async sendPasswordResetEmail(to, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: {
                name: process.env.FROM_NAME || 'Your App',
                address: process.env.FROM_EMAIL || 'noreply@yourapp.com'
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
              <p>Hello,</p>
              <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f1f1f1; padding: 10px; border-radius: 3px;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons.
              </div>
              <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
            </div>
            <div class="footer">
              <p>This email was sent from ${process.env.FROM_NAME || 'Your App'}. Please do not reply to this email.</p>
              <p>If you continue to have problems, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Password reset email sent successfully:', info.messageId);
        }
        catch (error) {
            console.error('❌ Failed to send password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
    async sendPasswordChangeConfirmation(to) {
        const mailOptions = {
            from: {
                name: process.env.FROM_NAME || 'Your App',
                address: process.env.FROM_EMAIL || 'noreply@yourapp.com'
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
              <h1>✅ Password Changed Successfully</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <div class="success">
                <p><strong>Your password has been successfully changed.</strong></p>
              </div>
              <p>If you didn't make this change, please contact our support team immediately.</p>
              <p>For your security:</p>
              <ul>
                <li>Make sure you're the only one who knows your new password</li>
                <li>Don't share your password with anyone</li>
                <li>Use a strong, unique password for your account</li>
              </ul>
            </div>
            <div class="footer">
              <p>This email was sent from ${process.env.FROM_NAME || 'Your App'}. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Password change confirmation email sent:', info.messageId);
        }
        catch (error) {
            console.error('❌ Failed to send confirmation email:', error);
            throw new Error('Failed to send confirmation email');
        }
    }
    async sendContactFormEmail(name, email, subject, message) {
        const mailOptions = {
            from: {
                name: process.env.FROM_NAME || 'Civil Digital Store',
                address: process.env.FROM_EMAIL || 'noreply@civildigitalstore.com'
            },
            to: process.env.CONTACT_EMAIL || 'ujuj2451@gmail.com',
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
            <h1>📧 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">From:</div>
              <div class="field-value">${name} </div>
            </div>
            <div class="field">
              <div class="field-label">Email:</div>
              <div class="field-value">${email}</div>
            </div>
            <div class="field">
              <div class="field-label">Subject:</div>
              <div class="field-value">${subject}</div>
            </div>
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="field-value">${message}</div>
            </div>
            <div class="field">
              <div class="field-label">Submitted At:</div>
              <div class="field-value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from the contact form on ${process.env.FROM_NAME || 'Civil Digital Store'}.</p>
            <p>You can reply directly to this email to contact ${name}.</p>
          </div>
        </div>
      </body>
      </html>
    `
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Contact form email sent successfully:', info.messageId);
        }
        catch (error) {
            console.error('❌ Failed to send contact form email:', error);
            throw new Error('Failed to send contact form email');
        }
    }
}
exports.default = new EmailService();
