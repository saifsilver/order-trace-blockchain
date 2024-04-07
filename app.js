require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Blockchain = require('./src/blockchain');
// const Transaction = require('./src/transaction');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET; // Change this to a secure secret key

let myBlockchain = new Blockchain();

app.use(bodyParser.json());

// Authentication middleware
const authenticateUser = (req, res, next) => {
    // Check for Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    // Verify JWT token
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden. Invalid token.' });
        }
        req.user = user;
        next();
    });
};

// Login route
app.post('/login', (req, res) => {
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

// Endpoint to get the entire blockchain (requires authentication)
app.get('/blockchain', authenticateUser, (req, res) => {
    res.json(myBlockchain.chain);
});

// Endpoint to create a new order (requires authentication)
app.post('/order', authenticateUser, (req, res) => {
    const { id, products, customer } = req.body;
    if (!id || !products || !customer) {
        return res.status(400).json({ error: 'Invalid request. Missing required fields.' });
    }
    const order = {
        id,
        products,
        customer
    };
    myBlockchain.createOrderTransaction(order);
    res.json({ message: 'Order added to the pending transactions.' });
});

// Endpoint to create a new delivery (requires authentication)
app.post('/delivery', authenticateUser, (req, res) => {
    const { orderId, deliveryId, status, deliveryPerson } = req.body;
    if (!orderId || !deliveryId || !status || !deliveryPerson) {
        return res.status(400).json({ error: 'Invalid request. Missing required fields.' });
    }
    const delivery = {
        orderId,
        deliveryId,
        status,
        deliveryPerson,
        timestamp: new Date()
    };
    myBlockchain.createDeliveryTransaction(delivery);
    res.json({ message: 'Delivery added to the pending transactions.' });
});

// Endpoint to mine pending transactions and add them to the blockchain (requires authentication)
app.get('/mine', authenticateUser, (req, res) => {
    myBlockchain.minePendingTransactions();
    res.json({ message: 'Pending transactions mined and added to the blockchain.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
