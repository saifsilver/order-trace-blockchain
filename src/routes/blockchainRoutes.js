const express = require('express');
const router = express.Router();
const myBlockchain = require('../blockchain/blockchain');
const authenticateUser = require('../middlewares/authenticateUser');

router.get('/', authenticateUser, (req, res) => {
    res.json(myBlockchain.chain);
});

router.get('/mine', authenticateUser, (req, res) => {
    myBlockchain.minePendingTransactions();
    res.json({ message: 'Pending transactions mined and added to the blockchain.' });
});

module.exports = router;