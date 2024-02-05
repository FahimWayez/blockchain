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
    // console.log('Pending Transactions:', dclCoin.pendingTransactions);
    res.send(dclCoin);
});

//when hit, it will create a new transaction in the blockchain
app.post('/transaction', function (req, res) {
    try {
        // console.log(req.body);
        // res.send(`The amount of the transaction is ${req.body.amount} dlcCoin.`);

        // const blockIndex = dclCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
        // res.json({ note: `Transaction will be added in block ${blockIndex}.` });

        const newTransaction = req.body;
        const blockIndex = dclCoin.addTransactionToPendingTransactions(newTransaction);
        res.json({ note: `Transaction will be added in block ${blockIndex}.` });

    }
    catch (error) {
        console.error('Error processing transaction: ', error);
        res.status(500).json({ error: 'Failed to process transaction' });
    };
});

app.post('/transaction/broadcast', function (req, res) {
    try {
        const newTransaction = dclCoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
        dclCoin.addTransactionToPendingTransactions(newTransaction);
        //cycling through every node of the network and sending the new transaction to each nodes /transaction endpoint.
        const requestPromises = [];
        dclCoin.networkNodes.forEach(networkNodeUrl => {
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
                res.json({ note: 'Transaction created and broadcast successfully.' });
            });
    }
    catch (error) {
        console.error('Error broadcasting transaction: ', error);
        res.status(500).json({ error: 'Failed to broadcast transaction' });
    };
});

//when hit, it will mine or create a new block for us
app.get('/mine', function (req, res) {
    try {
        const lastBlock = dclCoin.getLastBlock();
        const previousBlockHash = lastBlock['hash'];
        const currentBlockData = {
            transactions: dclCoin.pendingTransactions,
            index: lastBlock['index'] + 1
        };
        const nonce = dclCoin.proofOfWork(previousBlockHash, currentBlockData);
        const blockHash = dclCoin.hashBlock(previousBlockHash, currentBlockData, nonce);
        const newBlock = dclCoin.createNewBlock(nonce, previousBlockHash, blockHash);

        const requestPromises = [];
        dclCoin.networkNodes.forEach(networkNodeUrl => {
            const requestOptions = {
                uri: networkNodeUrl + '/receive-new-block',
                method: 'POST',
                body: { newBlock: newBlock },
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        //broadcasting the miner rewards to the network
        Promise.all(requestPromises)
            .then(data => {
                const requestOptions = {
                    uri: dclCoin.currentNodeUrl + '/transaction/broadcast',
                    method: 'POST',
                    body: {
                        amount: 6.25,
                        sender: "Fahim",
                        recipient: nodeAddress
                    },
                    json: true
                };

                return rp(requestOptions);
            })
            .then(data => {
                res.json({
                    note: "New block mined & broadcast successfully",
                    block: newBlock
                });
            });
    }
    catch (error) {
        console.error('Error mining block: ', error);
        res.status(500).json({ error: 'Failed to mine block' });
    };
});

app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = dclCoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        dclCoin.chain.push(newBlock);
        dclCoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock: newBlock
        });
    }
});

//when hit, it will register and broadcast a node to the network
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (dclCoin.networkNodes.indexOf(newNodeUrl) == -1) dclCoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    dclCoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [...dclCoin.networkNodes, dclCoin.currentNodeUrl] },
                json: true
            };

            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ note: 'New node registered with network successfully.' });
        });
});



//when hit, it will register a node to the network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = dclCoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = dclCoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) dclCoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.' });
});


//when hit, it will register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = dclCoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = dclCoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) dclCoin.networkNodes.push(networkNodeUrl);
    });

    res.json({ note: 'Bulk registration successful.' });
});


//when hit, it will check if the newly created networks has the updated data or not, if not, it will add
app.get('/consensus', function (req, res) {
    try {
        const requestPromises = [];
        dclCoin.networkNodes.forEach(networkNodeUrl => {
            const requestOptions = {
                uri: networkNodeUrl + '/blockchain',
                method: 'GET',
                json: true
            };

            requestPromises.push(rp(requestOptions));
        });

        Promise.all(requestPromises)
            .then(blockchains => {
                const currentChainLength = dclCoin.chain.length;
                let maxChainLength = currentChainLength;
                let newLongestChain = null;
                let newPendingTransactions = null;
                blockchains.forEach(blockchain => {
                    if (blockchain.chain.length > maxChainLength) {
                        maxChainLength = blockchain.chain.length;
                        newLongestChain = blockchain.chain;
                        newPendingTransactions = blockchain.pendingTransactions;
                    };
                });

                if (!newLongestChain || (newLongestChain && !dclCoin.chainIsValid(newLongestChain))) {
                    res.json({
                        note: 'Current chain has not been replaced.',
                        chain: dclCoin.chain
                    });
                }
                else { //if (newLongestChain && dclCoin.chainIsValid(newLongestChain))
                    dclCoin.chain = newLongestChain;
                    dclCoin.pendingTransactions = newPendingTransactions;

                    res.json({
                        note: 'This chain has been replaced',
                        chain: dclCoin.chain
                    });
                }
            });
    }
    catch (error) {
        console.error('Error performing consensus operations: ', error);
        res.status(500).json({ error: 'Failed to perform consensus' });
    };
});

//search by block hash
app.get('/block/:blockHash', function (req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = dclCoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

//search by transaction ID
app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = dclCoin.getTransaction(transactionId);

    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    });
});

//search by address
app.get('/address/:address', function (req, res) {
    const address = req.params.address;
    const addressData = dclCoin.getAddressData(address);

    res.json({
        addressData: addressData
    });
});

// app.use('/transaction', express);
app.listen(port, function () {
    console.log(`Listening to port ${port}...`);
})
