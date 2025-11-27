import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_SENDER,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("SendGrid email error:", err);
    throw err;
  }
};

export default sendEmail;
