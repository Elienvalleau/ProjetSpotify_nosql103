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
let headersData = {Authorization: 'Bearer BQCcdoWJe0LMMQBusKAxmiizbcgxA9e_dB7nQH1yJqSMhzRZqngirkNTt7s0Vau_MF3_uUme_vgv5GtnR3hL_ZqMttTe4oeyGvsxutkEy3K5cNk2g27g900d9sYsZD9LOmlPl5tLnJpKFo2WPe91M-nW'}

mongooseDB.connect();

app.use("/salle", express.static(__dirname + "/views/room"));

//Connexion d'un client
io.on('connection', function (socket) {
  console.log('User ' + socket.id + ' connected');
  
  //Gestion déconnection
  socket.on('disconnect', function () {
    console.log('User ' + socket.id + ' disconected');
  });

  //Emission d'un message vers tout les clients
  socket.on('chat-message', function (message) {
    console.log(socket.id + ' : ' + message)
    io.emit('chat-message', message);
  });

  //Gestion de la fonction Play/Pause
  socket.on('playPause', function() {
    let url = 'https://api.spotify.com/v1/me/player/'
    if (isMusicPlay) {
      isMusicPlay = false
      url += 'pause'
    } else if (!isMusicPlay) {
      isMusicPlay = true
      url += 'play'
    }
    
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
        console.log('ERROR REQUEST: playPause ' + response.statusCode)
      }
    });
  })

  //Gestion de la fonction previous
  socket.on('previous' ,function() {
    let url = 'https://api.spotify.com/v1/me/player/previous'
    let req = {
      method: 'POST',
      headers: headersData,
      url : url,
    }
    request(req, function (error, response, body) {
      if (!error && response.statusCode == 204) {
        console.log('previous succes')
        io.emit('chat-message', {text: 'Previous music by ' + socket.id})
      } else {
        console.log('ERROR REQUEST: previous ' + response.statusCode)
      }
    });
  })

  //Gestion de la fonction next
  socket.on('next' ,function() {
    let url = 'https://api.spotify.com/v1/me/player/next'
    let req = {
      method: 'POST',
      headers: headersData,
      url : url,
    }
    request(req, function (error, response, body) {
      if (!error && response.statusCode == 204) {
        console.log('next succes')
        io.emit('chat-message', {text: 'Next music by ' + socket.id})
      } else {
        console.log('ERROR REQUEST: next ' + response.statusCode)
      }
    });
  })
});

app.use('/', require('./controllers/connexionController'));
app.use('/salle', require('./controllers/salleController'));


http.listen(8888, function () {
    console.log('Server is listening on *:8888');
});


