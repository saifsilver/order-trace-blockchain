const express = require('express');
const router = express.Router();
const myBlockchain = require('../blockchain/blockchain');
const Transaction = require('../models/transaction');
const authenticateUser = require('../middlewares/authenticateUser');

router.post('/', authenticateUser, (req, res) => {
    const { id, products, customer } = req.body;
    if (!id || !products || !customer) {
        return res.status(400).json({ error: 'Invalid request. Missing required fields.' });
    }
    const order = {
        id,
        products,
        customer
    };
    const newTransaction = new Transaction('order', order);
    myBlockchain.createOrderTransaction(newTransaction);
    res.json({ message: 'Order added to the pending transactions.' });
});

module.exports = router;
