// utils/sendEmail.js
const sgMail = require ("@sendgrid/mail");

// Use environment variable directly
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER;

if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith("SG.")) {
  console.error("❌ SendGrid API key is missing or invalid!");
}

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await sgMail.send({
      to,
      from: SENDGRID_SENDER,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
