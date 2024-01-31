const sha256 = require('sha256');
function Blockchain() {
    this.chain = []; //shobgula block ja banabo ja mine hobe shob ekhane chain akare add hobe
    this.pendingTransactions = []; //shob transaction hold hobe, even before egula block e dhukar age
}

//creating new block
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}


//getting the previous block in chain
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}



//creating new transaction
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
    };

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;
}


Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;

}
module.exports = Blockchain;