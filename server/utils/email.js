// server/utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Transporter banayein (GMAIL ke liye)
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Service ka naam batayein
    auth: {
      user: process.env.EMAIL_USERNAME, // Aapki poori Gmail ID (e.g., 'your.email@gmail.com')
      pass: process.env.EMAIL_PASSWORD  // Aapka 16-character ka App Password
    }
  });

  // 2) Email ke options define karein
  const mailOptions = {
    from: `Project Management <${process.env.EMAIL_USERNAME}>`, // From mein bhi aapka email hoga
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Email bhejein
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;