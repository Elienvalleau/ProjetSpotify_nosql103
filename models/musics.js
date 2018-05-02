const db = require('../db');
const Musics = db.model('Music', {
  musicId: { type: String, required: true },
  musicName: { type: String, required: true },
  date:     { type: Date, required: true, default: Date.now }
});
module.exports = Musics;