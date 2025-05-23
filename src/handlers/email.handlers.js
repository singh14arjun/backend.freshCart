import transporter from "../config/nodemailer.config.js";

export async function sendEmail(to, subject, html) {
  return await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    html: html,
  });
}

export async function sendEmailVerification(to, subject, html) {
  return await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    html: html,
  });
}
