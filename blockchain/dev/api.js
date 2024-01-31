var express = require('express')
var app = express()


//when hitted, the entire blockchain will be sent
app.get('/blockchain', function (req, res) {

});



//when hitted, it will create a new transaction in the blockchain
app.post('/transaction', function (req, res) {

});


//when hitted, it will mine or create a new block for us
app.get('/mine', function (req, res) {

});

app.listen(3000, function () {
    console.log('Listening to port 3000...');
})