//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if (err){
        return console.log('Unable to connect to mongo db', err);
    }
    console.log('Connected to mongo db');

    /*
    db.collection('Users').deleteMany({ text: "Jimmy Fallmann" }).then((result) => {
        console.log(result);
    }, (err) => {
        if (err){
            return console.log('There was a problem deleting from the db', err);
        }
    })
    
    */
    
    /* deleteONe
    db.collection('Todos').deleteOne({ text: "Testing deletions"}).then((result) => {
        console.log(result);
    }, (err) => {
        if (err){
            return console.log('There was a problem deleting from the db', err);
        }
    })
    */

    /* findOneAndDelete
    db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
        console.log(result);
    }, (err) => {
        if (err){
            return console.log('There was a problem deleting from the db', err);
        }
    })
    */

    // db.close();


});

