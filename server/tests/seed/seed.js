const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {mongoose} = require('../../db/mongoose');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const id1 = new ObjectID();
const id2 = new ObjectID();

const users  = [{
           _id: id1,
           email: 'sfallmann@pbmbrands.com',
           password: 'password1',
           tokens: [{
               access: 'auth',
               token: jwt.sign({ _id: id1, access: 'auth' }, 'abc123').toString()
            }]
        }, {
           _id: id2,
           email: 'jorundr@hotmail.com',
           password: 'dontguessthis',
        }]

const todos = [
    {
        _id: new ObjectID(),
        text: "Todo 1",
        _creator: id1
    },
    {
        _id: new ObjectID(),
        text: "Todo 2",
        completed: true,
        completedAt: new Date().getTime(),
        _creator: id2
    },
    /*
    {
        _id: new ObjectID(),
        text: "Todo 3",
        completed: false,
        comepleteAt: null,
        _creator: id1        
    }      */
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
       var user1 = new User(users[0]).save();
       var user2 = new User(users[1]).save();

       return Promise.all([user1, user2]);
    }).then(() => done());
}

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {todos, users, populateTodos, populateUsers};