const mongooseDB = require("./db");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");
const request = require('request');



mongooseDB.connect();

app.use("/salle", express.static(__dirname + "/views/room"));

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconected');
  });

  socket.on('chat-message', function (message) {
    io.emit('chat-message', message);
  });

  socket.on('playPause', function() {
    let url = 'https://api.spotify.com/v1/me/player/pause'
    let headersData = {Authorization: 'Bearer BQBZhL_hIokfe7TQLYPtKYa5rixZqvqHX9_YypgK5BjVvwrO0UBQRNQctmTq-VxmIRM4r3mN7ms93uFEXJCrXijI0LdBifrFyab9FHN4OyR1wATz0g5na2uu0Wa7QvrI3Qhh9hfGcZTTmvt-jF7lGl7C'}
    let bodyData = { }
    let req = {
      method: 'PUT',
      headers: headersData,
      url : url,
    }
    request(req, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Patate')
      } else {
        console.log(response.statusCode)
      }
    });
  })
});

app.use('/', require('./controllers/connexionController'));
app.use('/salle', require('./controllers/salleController'));


http.listen(8888, function () {
    console.log('Server is listening on *:8888');
});


