const SHA256 = require('crypto-js/sha256');
const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block("01/01/2024", []);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    createOrderTransaction(orderData) {
        const newTransaction = {
            type: 'order',
            data: orderData
        };
        this.pendingTransactions.push(newTransaction);
    }

    createDeliveryTransaction(deliveryData) {
        const newTransaction = {
            type: 'delivery',
            data: deliveryData
        };
        this.pendingTransactions.push(newTransaction);
    }

    minePendingTransactions() {
        const block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = new Blockchain;
