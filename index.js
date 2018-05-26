const mongooseDB = require("./db");
const express = require('express');
const path = require("path");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");
const redis = require("redis");
// const client = redis.createClient({detect_buffers: true});
const client = redis.createClient();

mongooseDB.connect();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/:salle", express.static(__dirname + "/views/room"));

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconected');
  });

  socket.on('chat-message', function (message) {
    io.emit('chat-message', message);


    client.on("error", function (err) {
      console.log("Error " + err);
    });

    let time = Math.floor(Date.now() / 1000);
    const aMessage = JSON.stringify(message);
    const bMessage = aMessage.slice(9, -2);
    client.set(time, bMessage, 'EX', 3600);
  });
});

app.use('/main', require('./controllers/roomController'));
app.use('/', require('./controllers/connexionController'));
app.use('/:salle', require('./controllers/salleController'));

http.listen(8888, function () {
    console.log('Server is listening on *:8888');
});
