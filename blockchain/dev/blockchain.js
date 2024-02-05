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
    try {
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
    catch (error) {
        console.error('Error creating a new block: ', error);
        throw new Error('Failed to create a new block.');
    };
}


//getting the previous block in chain
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
}

//creating new transaction
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    try {
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
    catch (error) {
        console.error('Error creating a new transaction: ', error);
        throw new Error('Failed to create a new transaction.');
    };
}


Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObject) {
    try {
        this.pendingTransactions.push(transactionObject);
        return this.getLastBlock()['index'] + 1;
    }
    catch (error) {
        console.error('Error adding transaction to pending transactions: ', error);
        throw new Error('Failed to add transaction to pending transactions.');
    };
}


//Hashing the blocks
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);

    return hash;
}


//generating the specific nonce value
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    try {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }

        return nonce;
    }
    catch (error) {
        console.error('Error in proof of work: ', error);
        throw new Error('Failed to perform proof of work.');
    };
}

//validating if a chain is legitimate or not
Blockchain.prototype.chainIsValid = function (blockchain) {
    try {
        let validChain = true;

        for (var i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const prevBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
            if (blockHash.substring(0, 4) !== '0000') validChain = false;
            if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
        };

        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0000';
        const correctHash = genesisBlock['hash'] === '1111';
        const correctTransactions = genesisBlock['transactions'].length === 0;

        if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

        return validChain;
    }
    catch (error) {
        console.error('Error validating chain: ', error);
        throw new Error('Failed to validate chain.');
    };
};


Blockchain.prototype.getBlock = function (blockHash) {
    try {
        let correctBlock = null;
        this.chain.forEach(block => {
            if (block.hash === blockHash) correctBlock = block;
        });

        return correctBlock;
    }
    catch (error) {
        console.error('Error getting block: ', error);
        throw new Error('Failed to get block');
    };
};


Blockchain.prototype.getTransaction = function (transactionId) {
    try {
        let correctTransaction = null;
        let correctBlock = null;
        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if (transaction.transactionId === transactionId) {
                    correctTransaction = transaction;
                    correctBlock = block;
                };
            });
        });

        return {
            transaction: correctTransaction,
            block: correctBlock
        };
    }
    catch (error) {
        console.error('Error getting transaction: ', error);
        throw new Error('Failed to get transaction');
    };
};

Blockchain.prototype.getAddressData = function (address) {
    try {
        const addressTransactions = [];

        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if (transaction.sender === address || transaction.recipient === address) {
                    addressTransactions.push(transaction);
                };
            });
        });

        let balance = 0;
        addressTransactions.forEach(transaction => {
            if (transaction.recipient === address) balance += transaction.amount;
            else if (transaction.sender === address) balance -= transaction.amount;
        });

        return {
            addressTransactions: addressTransactions,
            addressBalance: balance
        };
    }
    catch (error) {
        console.error('Error getting transaction: ', error);
        throw new Error('Failed to get transaction');
    };
};


module.exports = Blockchain;

