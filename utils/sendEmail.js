const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  try {
    // 1) CREATE A TRANSPORTER => transporter in a service that will actually send the email like Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 2) DEFINE THE EMAIL OPTIONS THAT WE WILL PASS TO sendEmail function
    const mailOptions = {
      from: 'ahmedhossam9226@gmail.com',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // 3) SEND THE EMAIL
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = sendEmail;