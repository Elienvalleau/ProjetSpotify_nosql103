const mongooseDB = require("./db");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");
const request = require('request');

let isMusicPlay = false

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
    let url = 'https://api.spotify.com/v1/me/player/'
    if (isMusicPlay) {
      isMusicPlay = false
      url += 'pause'
    } else if (!isMusicPlay) {
      isMusicPlay = true
      url += 'play'
    }
    
    let headersData = {Authorization: 'Bearer BQAEnklYtGyRSpGhRghlbbzV1l76TD2CwdYtyUUdTc7MVZcaGJlm5FQZ5u9wqqlOGvbolELdqZ8ncsVkHvmZAm0S-W8uRWnpBvff2xrWoyNiIvgfwvmJMMxlvZvBNfjk19k6VwRq4GTiAmYD2xKsGLzZ'}
    let bodyData = { }
    let req = {
      method: 'PUT',
      headers: headersData,
      url : url,
    }
    request(req, function (error, response, body) {
      if (!error && response.statusCode == 204) {
        console.log('playPause succes')
        io.emit('chat-message', {text: 'isMusicPlay ' + isMusicPlay + ' by ' + socket.id})
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


