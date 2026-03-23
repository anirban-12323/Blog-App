const nodemailer = require("nodemailer");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  EMAIL_HOST: "smtp.gmail.com",
  EMAIL_PORT: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    EMAIL_USER: "anirbanguharoy82@gmail.com",
    EMAIL_PASS: "fang ibav ddxh hfyg",
  },
});

module.exports = transporter;
