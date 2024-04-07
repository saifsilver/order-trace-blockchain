const express = require('express');
const router = express.Router();
const myBlockchain = require('../blockchain/blockchain');
const Transaction = require('../models/transaction');
const authenticateUser = require('../middlewares/authenticateUser');

router.post('/', authenticateUser, (req, res) => {
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
    const newTransaction = new Transaction('delivery', delivery);
    myBlockchain.createDeliveryTransaction(newTransaction);
    res.json({ message: 'Delivery added to the pending transactions.' });
});

module.exports = router;
