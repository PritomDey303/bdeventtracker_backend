const nodemailer = require("nodemailer");
class EmailHandler {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //send mail
  async sendEmail(to, subject, body) {
    const options = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      html: body,
    };
    let info = await this.transporter.sendMail(options);
    return info;
  }

  //verify mail
  async verificationEmailBuilder(token) {
    const html = `
          <h1>Please verify your email address</h1>
          <p>You must verify your email address to complete your registration.</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${process.env.CLIENT_URL}/auth/verify/${token}">
            ${process.env.CLIENT_URL}/auth/verify/${token}
          </a>
          <p>If you did not sign up to our site, please ignore this email.</p>
        `;
    return html;
  }
}

module.exports = EmailHandler;
