class Transaction {
    constructor(type, data) {
        this.type = type; // 'order' or 'delivery'
        this.data = data; // Order or delivery object
    }
}

module.exports = Transaction;
