const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req, res, next) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log(doc);
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log('Started on port ', port);
})
