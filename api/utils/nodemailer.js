const nodemailer = require("nodemailer");

if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL or EMAIL_PASS missing in env", {
        EMAIL: process.env.EMAIL,
        EMAIL_PASS: process.env.EMAIL_PASS ? "LOADED" : "MISSING",
    });
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465
    auth: {
        user: process.env.EMAIL,      // MUST match .env
        pass: process.env.EMAIL_PASS // App password
    },
});

const sendMail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"WeMeet Support" <${process.env.EMAIL}>`,
        to,
        subject,
        html,
    });
};

module.exports = { sendMail };