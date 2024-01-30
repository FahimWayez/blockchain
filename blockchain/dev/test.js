const Blockchain = require('./blockchain');

const dclCoin = new Blockchain();

dclCoin.createNewBlock(123, '0x0000', 'asdf1234');
dclCoin.createNewTransaction(100, 'FAHIMx32nj12', 'RIAN3wredfdd')

dclCoin.createNewBlock(24234, 'asdf1234', 'uytre98uy');



console.log('dclCoin', dclCoin);
console.log('dclCoin', dclCoin.chain[1]); //transaction add hoise notun kore oita dekhano shudhu