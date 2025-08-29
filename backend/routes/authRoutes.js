// backend/routes/authRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const router = express.Router();
dotenv.config();

// Utility function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ username, password, isAdmin: false });
        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                _id: user._id,
                username: user.username,
                token: generateToken(user._id),
                isAdmin: user.isAdmin
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            res.json({
                message: 'Login successful',
                _id: user._id,
                username: user.username,
                token: generateToken(user._id),
                isAdmin: user.isAdmin // Pass isAdmin status to the frontend
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/admin-init
// @desc    Initialize a default admin user (run once)
// @access  Public
router.post('/admin-init', async (req, res) => {
    const { username, password } = req.body;
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin user already exists. Skipping initialization.' });
    }
    try {
        const adminUser = await User.create({ username, password, isAdmin: true });
        if (adminUser) {
            console.log('Admin user initialized successfully:', adminUser.username);
            res.status(201).json({ message: 'Admin user initialized successfully', _id: adminUser._id, isAdmin: adminUser.isAdmin });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/delete-user
// @desc    Temporary route to delete a user by username (for fixing issues)
// @access  Public
router.post('/delete-user', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await User.deleteOne({ username });
        if (result.deletedCount > 0) {
            res.json({ message: `User '${username}' deleted successfully.` });
        } else {
            res.status(404).json({ message: `User '${username}' not found.` });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;