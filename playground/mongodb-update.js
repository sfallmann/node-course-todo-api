//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if (err){
        return console.log('Unable to connect to mongo db', err);
    }
    console.log('Connected to mongo db');

    db.collection('Users').findOneAndUpdate({ 
        _id: new ObjectID("5888c2ae7067d904205b34bd")
    }, { 
        $inc: { age: -1 },
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
    db.close();


});

