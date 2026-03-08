const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email verification link to the given address.
 * @param {string} email - Recipient email address
 * @param {string} token - UUID verification token
 */
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Catmio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Catmio account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Catmio!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}"
           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;
                  text-decoration:none;border-radius:6px;font-weight:bold;">
          Verify Email
        </a>
        <p style="margin-top:16px;color:#6b7280;font-size:14px;">
          Or copy and paste this link: ${verificationUrl}
        </p>
        <p style="color:#6b7280;font-size:12px;">
          This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

/**
 * Send a welcome email after successful email verification.
 * @param {string} email - Recipient email address
 */
async function sendWelcomeEmail(email) {
  await transporter.sendMail({
    from: `"Catmio" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Catmio!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're all set! 🎉</h2>
        <p>Your Catmio account has been verified and is ready to use.</p>
        <p>Get started by logging in to your dashboard:</p>
        <a href="${process.env.FRONTEND_URL}/dashboard"
           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;
                  text-decoration:none;border-radius:6px;font-weight:bold;">
          Go to Dashboard
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:24px;">
          If you have any questions, contact us at support@catmio.com
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail, sendWelcomeEmail };
