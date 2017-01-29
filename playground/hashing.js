const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 112
};


var token = jwt.sign(data, '123qwe');
console.log(token);

var decoded = jwt.verify(token, 'q123qwe');
console.log(decoded);

/*
var message = 'I am user #3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

if (resultHash === token.hash){
    console.log("Data was good - trustworthy")
}
else {
    console.log("Bad data - don't trust it!");
}
*/