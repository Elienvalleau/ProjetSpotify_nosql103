const db = require('../db');
const Users = db.model('User', {
  username: { type: String, required: true },
  date:     { type: Date, required: true, default: Date.now }
});
module.exports = Users;


// const db = require('../db');
//
// exports.insertTest = function() {
//   // const collection = db.get().collection('users');
//   let collection = db.get().collection('users');
//
//   collection.insert([{name: 'testSpot1'}, {name: 'testSpot2'}]);
//
// };
//
// exports.all = function(cb) {
//   const collection = db.get().collection('users');
//
//   collection.find().toArray(function(err, docs) {
//     cb(err, docs)
//   })
// };