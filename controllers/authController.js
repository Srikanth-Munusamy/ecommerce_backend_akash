const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize'); 
const User = require('../models/User');

// Utility function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Registration
exports.register = async (req, res) => {
    const { fullname, username, email, password, bio, location, profession, role } = req.body;
    const profilepic = req.file ? req.file.filename : null; // Get image path from multer
  
    try {
      // Check if email or username already exists
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
  
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
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
      });
  
      // Generate JWT token
      const token = generateToken(newUser);
      res.status(201).json({ token, user: newUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

