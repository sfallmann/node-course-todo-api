var mongoose = require('mongoose');

var User = mongoose.model('User',{
    email:{
        type: String,        
        require: true,
        trim: true,
        minlength: 7
    }

});

module.exports = {User};