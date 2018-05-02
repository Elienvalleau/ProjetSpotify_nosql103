const db = require('../db');
const Users = db.model('User', {
  username: { type: String, required: true },
  date:     { type: Date, required: true, default: Date.now }
});
module.exports = Users;