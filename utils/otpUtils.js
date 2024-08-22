const crypto = require('crypto');
const nodemailer = require('nodemailer');
const OTP = require('../models/Otp'); 
const { Op } = require('sequelize'); 

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

exports.generateAndSendOtp = async (userId, email, type) => {
  const otpCode = crypto.randomInt(100000, 999999).toString(); 
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  try {
    const existingOtp = await OTP.findOne({
      where: {
        userId,
        type,
      },
    });

    if (existingOtp) {
      await existingOtp.destroy();
    }

    await OTP.create({
      userId,
      otpCode,
      type,
      expiresAt,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your OTP Code for ${type}`,
      text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error('Error generating or sending OTP');
  }
};

exports.verifyOtp = async (userId, otpCode, type) => {
  try {
    const otpEntry = await OTP.findOne({
      where: {
        userId,
        otpCode,
        type,
        expiresAt: {
          [Op.gt]: new Date(), 
        },
      },
    });

    if (!otpEntry) {
      return false; 
    }

    await otpEntry.destroy(); 
    return true;
  } catch (err) {
    throw new Error('Error verifying OTP');
  }
};
