const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const router = express.Router();
const db = require('./db');

// Password validation function
const validatePassword = (password) => {
    const hasNumber = /\d/; // Checks for at least one digit
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Checks for at least one special character
    return hasNumber.test(password) && hasSpecialChar.test(password) && password.length >= 8;
};

// Signup route
router.post('/signup', async (req, res) => {
    const { name, idNumber, email, phoneNumber, province, password } = req.body;

    if (!name || !idNumber || !email || !phoneNumber || !province || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long, include 1 number, and 1 special character.' });
    }

    try {
        // Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await db.query(
            'INSERT INTO users (name, id_number, email, phone_number, province, password) VALUES (?, ?, ?, ?, ?, ?)',
            [name, idNumber, email, phoneNumber, province, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
