import transporter from "../config/nodemailer.config.js";

export async function sendOTP(to, subject, html) {
  return await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    html: html,
  });
}
