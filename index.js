const mongooseDB = require("./db");
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");

mongooseDB.connect();
