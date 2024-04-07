const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }
    /**
     * Proof of Work (PoW) Implementation:
    PoW is implemented in the mineBlock method of the Block class.
    This method is called when a block is mined (i.e., when new transactions are added to a block and the block is added to the blockchain).
    The mineBlock method iterates through a nonce value until it finds a hash that meets the difficulty criteria (leading zeros).
    This process of finding a suitable hash requires computational work, which is the essence of PoW.
    * @param {*} difficulty 
    */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block("01/01/2024", [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
/**
 * Transaction Handling:

Transactions are handled within the Blockchain class.
The createOrderTransaction and createDeliveryTransaction methods are responsible for adding new order and delivery transactions to the pending transactions pool.
These transactions remain pending until they are mined into a block.
The minePendingTransactions method is responsible for mining pending transactions into a new block.
When this method is called, it creates a new block containing the pending transactions and mines it using PoW.
 * @param {*} orderData 
 */
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

module.exports = Blockchain;
