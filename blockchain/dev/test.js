const Blockchain = require('./blockchain');

const dclCoin = new Blockchain();

dclCoin.createNewBlock(123, '0x0000', 'asdf1234');
dclCoin.createNewBlock(342, 'asdf1234', 'poqw112');
dclCoin.createNewBlock(876, 'poqw112', 'tyrgdf12');
dclCoin.createNewBlock(100, 'tyrgdf12', '54dsfasa');

console.log('dclCoin', dclCoin);