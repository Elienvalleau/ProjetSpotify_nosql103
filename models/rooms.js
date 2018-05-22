const db = require('../db');
const Rooms = db.model('Room', {
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  date:     { type: Date, required: true, default: Date.now }
});

module.exports = Rooms;
