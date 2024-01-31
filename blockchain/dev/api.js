const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//jodi ekta request ashe json data shoho postman theke tokhon parse kore nitesi
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//when hit, the entire blockchain will be sent
app.get('/blockchain', function (req, res) {

});

//when hit, it will create a new transaction in the blockchain
app.post('/transaction', function (req, res) {
    console.log(req.body);
    res.send(`The amount of the transaction is ${req.body.amount} dlcCoin.`);
});

//when hit, it will mine or create a new block for us
app.get('/mine', function (req, res) {

});


// app.use('/transaction', express);
app.listen(3000, function () {
    console.log('Listening to port 3000...');
})