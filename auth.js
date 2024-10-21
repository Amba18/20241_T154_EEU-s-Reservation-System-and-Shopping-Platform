const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// JWT secret key
const JWT_SECRET = "your_jwt_secret_key";

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
