//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if (err){
        return console.log('Unable to connect to mongo db', err);
    }
    console.log('Connected to mongo db');

    db.collection('Todos').findOneAndUpdate({ 
        _id: "5888f5f3671af93c94f6418c" 
    }, { 
        $set: { completed: true }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    db.close();


});

