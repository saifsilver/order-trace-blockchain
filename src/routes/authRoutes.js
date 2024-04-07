const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Check if the username exists and the password is correct (replace this with your own logic)
    const user = {
        id: 1,
        username: 'admin',
        passwordHash: '$2a$10$Q75aOyhVDoM6HUq280yMzu/dO6.w3WHs7zSQeDqcFfjM5satXooua'
        //'$2a$10$2e1bFWUq2gFafQ28hAzZle4dwSmz7NGmUqXjy31RDTKD5mNBPx2iq' // Hashed password: "password"
    };

    // Verify password using bcrypt
    bcrypt.compare(password, user.passwordHash, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ error: 'Unauthorized. Invalid username or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token }); // Return 200 status code with token
    });
});

module.exports = router;
