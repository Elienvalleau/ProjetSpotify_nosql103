const mongooseDB = require("./db");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");

mongooseDB.connect();

var metal = new RoomMod({roomId: "FAKpkfksakfzakdms", roomName: "Metal"});

app.use("/", express.static(__dirname + "/views/main"));

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconected');
  });

  socket.on('chat-message', function (message) {
    io.emit('chat-message', message);
  });
});

app.use('/', require('./controllers/roomController'));

http.listen(8888, function () {
  console.log('Server is listening on *:8888');
});
