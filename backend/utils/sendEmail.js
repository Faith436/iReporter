const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendEmail({ to, subject, text }) {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_SENDER,
    subject,
    text,
  });
};


