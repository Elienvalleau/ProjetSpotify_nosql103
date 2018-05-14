const mongooseDB = require("./db");
const express = require('express');
const app = express();
const PORT = process.env.PORT|| 8080;
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");
const io = require('socket.io').listen(app.listen(PORT));

mongooseDB.connect();

app.use('/salle', require('./controllers/salleController'));

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'Welcome' });
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });
});