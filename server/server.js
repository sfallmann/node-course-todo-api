const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res, next) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log(doc);
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res, next) => {
    Todo.find().then((todos) => {
        console.log(todos);
        res.send({todos});
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.get('/todos/:id', (req, res, next) => {

    var id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send({});
    }

    Todo.findById(id).then((todo) => {

        if (!todo){
            return res.status(404).send({});
        }

        console.log(todo);
        res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.delete('/todos/:id', (req, res, next) => {
    var id = new ObjectID(req.params.id);

    if (!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findByIdAndRemove(id.toHexString()).then((todo) => {
        
        if(!todo){
            return res.status(404).send({});
        }

        console.log(todo);
        res.send({todo});

    }).catch((err) => {
        res.status(400).send(err);
    })

})

app.listen(port, () => {
    console.log('Started on port ', port);
})

module.exports = {app};