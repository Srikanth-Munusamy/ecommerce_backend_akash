const User = require('../models/User');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Display User Profile
exports.getUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId, { attributes: { exclude: ['password'] } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Update user profile
  exports.updateProfile = async (req, res) => {
    const { fullname, username, email, password, bio, location, profession } = req.body;
    const profilepic = req.file ? req.file.filename : null;
  
    try {
      // Find the user by ID
      const user = await User.findByPk(req.user.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Save old profile pic path to delete later if a new one is provided
      const oldProfilePicPath = user.profilepic ? path.join(__dirname, '..', 'uploads', 'dp', user.profilepic) : null;
  
      // Update fields
      user.fullname = fullname || user.fullname;
      user.username = username || user.username;
      user.email = email || user.email;
      user.bio = bio || user.bio;
      user.location = location || user.location;
      user.profession = profession || user.profession;
  
      // Update password if provided
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
  
      // Update profile pic if provided
      if (profilepic) {
        user.profilepic = profilepic;
      }
  
      await user.save();
  
      // Remove old profile pic if a new one was provided
      if (profilepic && oldProfilePicPath) {
        fs.unlink(oldProfilePicPath, (err) => {
          if (err) {
            console.error(`Failed to delete old profile picture: ${err.message}`);
          }
        });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Admin view all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Admin view user by id
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
