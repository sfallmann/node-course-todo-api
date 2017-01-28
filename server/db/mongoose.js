var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://"test":"test"@ds056009.mlab.com:56009/node-todo-sample');

module.exports = { mongoose };