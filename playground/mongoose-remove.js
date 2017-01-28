const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

/*
Todo.remove({}).then((result) => {
    console.log(result.result);
})
*/
// Todo.findOneAndRemove  returns doc
// Todo.findByIdAndRemove returns doc

Todo.findByIdAndRemove('588c81f5b5352afe5e3cce1f').then((result) => {
    console.log(result);
});