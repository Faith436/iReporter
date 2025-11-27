// utils/sendEmail.js
const sgMail = require("@sendgrid/mail");

// Read SendGrid API key and sender from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER =
  process.env.SENDGRID_SENDER || "wisdom.jeremiah.upti@gmail.com";

// Check for missing/invalid API key
if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith("SG.")) {
  console.error(
    "❌ SendGrid API key is missing or invalid! Emails will not be sent."
  );
}

// Set API key
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {Object} param0
 * @param {string} param0.to - Recipient email
 * @param {string} param0.subject - Email subject
 * @param {string} param0.text - Plain text body
 * @param {string} [param0.html] - HTML body (optional)
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!SENDGRID_API_KEY || !SENDGRID_API_KEY.startsWith("SG.")) {
    console.warn("⚠️ Skipping email send due to invalid API key.");
    return;
  }

  try {
    await sgMail.send({
      to,
      from: {
        email: SENDGRID_SENDER,
        name: "iReporter Notifications",
      },
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendEmail;
