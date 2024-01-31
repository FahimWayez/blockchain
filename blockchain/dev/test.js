const Blockchain = require('./blockchain');

const dclCoin = new Blockchain();


//testing for block generation
dclCoin.createNewBlock(123, '0x0000', 'asdf1234');
dclCoin.createNewTransaction(100, 'FAHIMx32nj12', 'RIAN3wredfdd')
dclCoin.createNewBlock(24234, 'asdf1234', 'uytre98uy');




//testing for transactions
console.log('dclCoin', dclCoin);
console.log('dclCoin', dclCoin.chain[1]); //transaction add hoise notun kore oita dekhano shudhu



//testing for hash
const previousBlockHash = 'asdasd123';
const currentBlockData = [
    {
        amount: 10,
        sender: 'asdasdasd',
        recipient: 'asdasdasd',
    },
    {
        amount: 20,
        sender: 'tyujhsdasd',
        recipient: 'kjhgfd',
    },
    {
        amount: 80,
        sender: 'jk',
        recipient: 'asdfg',
    },
];

const nonce = 102;

console.log(dclCoin.hashBlock(previousBlockHash, currentBlockData, nonce));