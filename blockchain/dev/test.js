const Blockchain = require('./blockchain');

const dclCoin = new Blockchain();


// //testing for block generation
// dclCoin.createNewBlock(123, '0x0000', 'asdf1234');
// dclCoin.createNewTransaction(100, 'FAHIMx32nj12', 'RIAN3wredfdd')
// dclCoin.createNewBlock(24234, 'asdf1234', 'uytre98uy');




// //testing for transactions
// console.log('dclCoin', dclCoin);
// console.log('dclCoin', dclCoin.chain[1]); //transaction add hoise notun kore oita dekhano shudhu



// //testing for hash
// const previousBlockHash = 'asdasd123';
// const currentBlockData = [
//     {
//         amount: 10,
//         sender: 'asdasdasd',
//         recipient: 'asdasdasd',
//     },
//     {
//         amount: 20,
//         sender: 'tyujhsdasd',
//         recipient: 'kjhgfd',
//     },
//     {
//         amount: 80,
//         sender: 'jk',
//         recipient: 'asdfg',
//     },
// ];

// // const nonce = 102;

// // console.log(dclCoin.hashBlock(previousBlockHash, currentBlockData, nonce));



// //testing proofOfWork
// console.log(dclCoin.proofOfWork(previousBlockHash, currentBlockData));

const dcl1 = {
    "chain": [
        {
            "index": 1,
            "timeStamp": 1706994994418,
            "transactions": [],
            "nonce": 100,
            "hash": "1111",
            "previousBlockHash": "0000"
        },
        {
            "index": 2,
            "timeStamp": 1706995013978,
            "transactions": [],
            "nonce": 47027,
            "hash": "00003c0daa774c1278cbce54ee6e27f6b3e713ece256f87c270bfbae5f7556a7",
            "previousBlockHash": "1111"
        },
        {
            "index": 3,
            "timeStamp": 1706995042502,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "97f159efbbc04bc9a1d96494be7e30cf",
                    "transactionId": "c2296a7a7ccd4d01b0064a4e258ff53e"
                },
                {
                    "amount": 10,
                    "sender": "Fahim",
                    "recipient": "Anha",
                    "transactionId": "de30cc387c2148c48f88778eaed667e7"
                },
                {
                    "amount": 15,
                    "sender": "Fahim",
                    "recipient": "Anha",
                    "transactionId": "58fd6a292b01479a9c41f60018193bec"
                },
                {
                    "amount": 25,
                    "sender": "Fahim",
                    "recipient": "Anha",
                    "transactionId": "e7a7cef077df4bbca999e3ace57602c2"
                }
            ],
            "nonce": 7413,
            "hash": "0000f494816a544a9e64105889103251432e41dc3c9d3e85fe0d6a555047337a",
            "previousBlockHash": "00003c0daa774c1278cbce54ee6e27f6b3e713ece256f87c270bfbae5f7556a7"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "97f159efbbc04bc9a1d96494be7e30cf",
            "transactionId": "24a4b2e090c1413f8ede177d79b6ac33"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}


console.log('Valid: ', dclCoin.chainIsValid(dcl1.chain));