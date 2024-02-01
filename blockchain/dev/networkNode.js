const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid').v4;
const nodeAddress = uuid().split('-').join('');
const rp = require('request-promise');

const port = process.argv[2];

const dclCoin = new Blockchain();

//jodi ekta request ashe json data shoho postman theke tokhon parse kore nitesi
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//when hit, the entire blockchain will be sent
app.get('/blockchain', function (req, res) {
    res.send(dclCoin);
});

//when hit, it will create a new transaction in the blockchain
app.post('/transaction', function (req, res) {
    // console.log(req.body);
    // res.send(`The amount of the transaction is ${req.body.amount} dlcCoin.`);

    // const blockIndex = dclCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    // res.json({ note: `Transaction will be added in block ${blockIndex}.` });

    const newTransaction = req.body;
    const blockIndex = dclCoin.addTransactionToPendingTransactions(newTransaction);

    res.json({ note: `Transaction will be added to block ${blockIndex}` });

});

app.post('/transaction/broadcast', function (req, res) {
    //new transaction creating and pushing to the array
    const newTransaction = dclCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    dclCoin.addTransactionToPendingTransactions(newTransaction);

    //cycling through every node of the network and sending the new transaction to each nodes /transaction endpoint.
    const requestPromises = [];
    dclCoin.networkNodes.foreach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    //after creating all the requests, passed to the array
    Promise.all(requestPromises)
        .then(data => {
            res.json({ note: 'Transaction Created and broadcast successfully.' });
        });
});

//when hit, it will mine or create a new block for us
app.get('/mine', function (req, res) {
    const lastBlock = dclCoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: dclCoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = dclCoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = dclCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    dclCoin.createNewTransaction(6.25, "00", nodeAddress)

    const newBlock = dclCoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});


// app.use('/transaction', express);
app.listen(port, function () {
    console.log(`Listening to port ${port}...`);
})