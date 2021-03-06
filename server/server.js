'use strict';

require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res, next) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res, next) => {
    Todo.find({ _creator: req.user._id }).then((todos) => {
        res.send({todos});
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.get('/todos/:id', authenticate, (req, res, next) => {

    const id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send({});
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if (!todo){
            return res.status(404).send({});
        }

        res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.delete('/todos/:id', authenticate, (req, res, next) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        
        if(!todo){
            return res.status(404).send({});
        }

        res.send({todo});

    }).catch((err) => {
        res.status(400).send(err);
    })

})

app.patch('/todos/:id', authenticate, (req, res, next) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)){
        return res.status(404).send({});
    }



    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.post('/users', (req, res, next) => {

    const body = _.pick(req.body, ['email', 'password']);

    const user = new User(body);

    user.generateAuthToken()
    .then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res, next) => {
    res.send(req.user);
})

app.post('/users/login', (req, res, next) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password)
    .then((user) => {

        return user.generateAuthToken()
            .then((token) => {
                res.header('x-auth', token).send(user);
            }).catch((err) => {
                res.status(400).send(err);
            });
    })
    .catch((err) => {
        res.status(400).send(err);
    });

})

app.delete('/users/me/token', authenticate, (req, res, next) => {
    req.user.removeToken(req.token)
    .then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.listen(port, () => {
    console.log('Started on port ', port);
})

module.exports = {app};