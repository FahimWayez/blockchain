const sha256 = require('sha256');
const uuid = require('uuid').v4;


function Blockchain() {
    this.chain = []; //shobgula block ja banabo ja mine hobe shob ekhane chain akare add hobe
    this.pendingTransactions = []; //shob transaction hold hobe, even before egula block e dhukar age

    this.createNewBlock(100, '0000', '1111');//to create the genesis block. These values could be anything
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
        transactionId: uuid().split('-').join('')
    };

    // this.pendingTransactions.push(newTransaction);
    // return this.getLastBlock()['index'] + 1;

    return newTransaction;
}


Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObject) {
    this.pendingTransactions.push(transactionObject);
    return this.getLastBlock()['index'] + 1;
}


//Hashing the blocks
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
}



//generating the specific nonce value
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
}



module.exports = Blockchain;