function Blockchain() {
    this.chain = []; //shobgula block ja banabo ja mine hobe shob ekhane chain akare add hobe
    this.newTransactions = []; //shob transaction hold hobe, even before egula block e dhukar age
}

//creating a new block
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timeStamp: Date.now(),
        transactions: this.newTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
    };

    this.newTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}