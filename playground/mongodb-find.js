//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err){
        return console.log('Unable to connect to mongo db', err);
    }

    console.log('Connected to mongo db');


    db.collection('Users').find({ name: { $regex: /JiMMy/, $options: "i"  } }).toArray().then((docs)=>{
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    },(err)=>{
        console.log('Unable to fetch users', err);
    });

    db.close();

});

