





// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
//
// // Connection URL
// const url = 'mongodb://localhost:27017';
//
// // Database Name
// const dbName = 'spotyroom';
//
// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//
//   const db = client.db(dbName);
//
//   insertDocuments(db, function() {
//     client.close();
//   });
//
//   // client.close();
// });


// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('test');
//   // Insert some documents
//   collection.insertMany([
//     {a : 4}, {a : 5}, {a : 6}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// };



// var MongoClient = require('mongodb').MongoClient;
//
// var URL = 'mongodb://localhost:27017/spotyroom';
//
// MongoClient.connect(URL, function(err, db) {
//   if (err) return;
//
//   var collection = db.collection('foods');
//   collection.insert({name: 'taco', tasty: true}, function(err, result) {
//     collection.find({name: 'taco'}).toArray(function(err, docs) {
//       console.log(docs[0]);
//       db.close()
//     })
//   })
// });


// const db = require('./db');
// const express = require('express');
// const app = express();
// const Users = require('./models/users');
//
// // Connect to Mongo on start
// db.connect('mongodb://localhost:27017/spotyroom', function(err) {
//   if (err) {
//     console.log('Unable to connect to Mongo.');
//     process.exit(1)
//   } else {
//     app.listen(3000, function() {
//       console.log('Listening on port 3000...')
//     })
//   }
// });
//
// Users.insertTest();



