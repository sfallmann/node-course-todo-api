//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if (err){
        return console.log('Unable to connect to mongo db', err);
    }

    console.log('Connected to mongo db');

    /*
    db.collection('Todos').insertOne({
        text: 'Some task to get done',
        completed: false
    },(err, result)=>{
        if (err){
            return console.log('Unable to insert document into collection Todos', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));

    });

    
    db.collection('Users').insertOne({
        name: 'Jimmy Fallmann',
        age: false,
        location: 'Kernersville, NC'
    },(err, result)=>{
        if (err){
            return console.log('Unable to insert document into collection Users', err);
        }

        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));

    });    
    */
    db.close();
});

