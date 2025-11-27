// utils/sendEmail.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error("❌ Missing RESEND_API_KEY. Emails will NOT be sent.");
}

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const response = await resend.emails.send({
      from: "iReporter <onboarding@resend.dev>",
      to,
      subject,
      html,
      text,
    });

    console.log(`✅ Email sent:`, response);
    return response;
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendEmail;
