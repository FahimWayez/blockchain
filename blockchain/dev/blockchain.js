const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid').v4;


function Blockchain() {
    this.chain = []; //shobgula block ja banabo ja mine hobe shob ekhane chain akare add hobe
    this.pendingTransactions = []; //shob transaction hold hobe, even before egula block e dhukar age

    this.currentNodeUrl = currentNodeUrl;

    this.networkNodes = [];

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

//validating if a chain is legitimate or not
Blockchain.prototype.chainInValid = function (blockchain) {

    let validChain = true;

    //iterating through every single block
    for (let i = 0; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(previousBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);

        if (blockHash.substring(0, 4) !== '0000') validChain = false;

        if (currentBlock['previousBlockHash'] !== previousBlock['hash']) validChain = false; //chain is invalid
    };

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0000';
    const correctHash = genesisBlock['hash'] === '1111';
    const correctTransaction = genesisBlock['transaction'].length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransaction) validChain = false;
    return validChain;
};


module.exports = Blockchain;

