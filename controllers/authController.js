const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const Otp = require('../models/Otp'); 
const { generateAndSendOtp, verifyOtp } = require('../utils/otpUtils'); 

const generateToken = (user) => {
  return jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
};

exports.register = async (req, res) => {
  const { fullname, username, email, password, bio, location, profession, role } = req.body;
  const profilepic = req.file ? req.file.path : null;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already in use' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      bio,
      location,
      profession,
      profilepic,
      role: role || 'user',
      isActive: false, 
    });

    await generateAndSendOtp(newUser.userId, email, 'registration');

    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { userId, otpCode } = req.body;

  try {
    const isValid = await verifyOtp(userId, otpCode, 'registration');
    if (isValid) {
      const user = await User.findByPk(userId);
      user.isActive = true;
      await user.save();
      res.status(200).json({ message: 'Account activated successfully' });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account not activated. Please verify your email.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await generateAndSendOtp(user.userId, email, 'password_reset');

    res.status(200).json({ message: 'Password reset initiated. Please check your email for the OTP.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { userId, otpCode, newPassword } = req.body;

  try {
    const isValid = await verifyOtp(userId, otpCode, 'password_reset');
    if (isValid) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findByPk(userId);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password reset successful' });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      // Resend OTP for account activation
      await generateAndSendOtp(user.userId, email, 'registration');
      res.status(200).json({ message: 'OTP resent for account activation. Please check your email.' });
    } else {
      // Resend OTP for password reset
      await generateAndSendOtp(user.userId, email, 'password_reset');
      res.status(200).json({ message: 'OTP resent for password reset. Please check your email.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
