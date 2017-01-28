const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res, next) => {
    let todo = new Todo({
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

    let id = req.params.id;
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
    let id = req.params.id;

    if (!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        
        if(!todo){
            return res.status(404).send({});
        }

        console.log(todo);
        res.send({todo});

    }).catch((err) => {
        res.status(400).send(err);
    })

})

app.patch('/todos/:id', (req, res, next) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    let body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, body, {new:true}).then((todo) => {

        if(!todo){
            return res.status(404).send({});
        }       

        res.send({todo});

    }).catch((err) => {
        res.status(400).send(err);
    })
})

app.listen(port, () => {
    console.log('Started on port ', port);
})

module.exports = {app};