const mongooseDB = require("./db");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MusicMod = require("./models/musics");
const RoomMod = require("./models/rooms");
const UserMod = require("./models/users");
const request = require('request');
const redis = require("redis");
// const client = redis.createClient({detect_buffers: true});
const client = redis.createClient();

let isMusicPlay = false
let headersData = {Authorization: 'Bearer BQCBAja48xnechNA8swTUEB8uW_HJBDYoieKwh1A_DCgjZzC0JHDsB-DXYihD1p1wgmNrJenlKRgnUiSBzzpWwOpyqJzZi2_8NtZXiP3mT2IsDBVv8dUO9ttcrtMOn2PPWmeCXPWoeTIiZkPABtP-BDz'}
let idCo = [];

mongooseDB.connect();

app.use("/salle", express.static(__dirname + "/views/room"));

//Connexion d'un client
io.on('connection', function (socket) {
  console.log('User ' + socket.id + ' connected');
  idCo.push(socket.id);
  io.emit('arrayCo', idCo);

  //Gestion déconnection
  socket.on('disconnect', function () {
    console.log('User ' + socket.id + ' disconected');
    idCo.splice(socket.id, 1);
    io.emit('arrayCo', idCo);
  });

  //Emission d'un message vers tout les clients
  socket.on('chat-message', function (message) {
    console.log(socket.id + ' : ' + message)
    io.emit('chat-message', message);

    client.on("error", function (err) {
      console.log("Error " + err);
    });

    let time = Math.floor(Date.now() / 1000);
    const aMessage = JSON.stringify(message);
    const bMessage = aMessage.slice(9, -2);
    client.set(time, bMessage, 'EX', 3600);
  });

  //Gestion de la fonction Play/Pause
  socket.on('playPause', async function() {
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
        getMusicPlaying()
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
        setTimeout(getMusicPlaying, 500);
      } else {
        console.log('ERROR REQUEST: previous ' + response.statusCode)
      }
    });
  })

  //Gestion de la fonction next
  socket.on('next' , function() {
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
        setTimeout(getMusicPlaying, 500);
      } else {
        console.log('ERROR REQUEST: next ' + response.statusCode)
      }
    });
  })


  //Cherche la musique actuelement joué et l'envoi
  function getMusicPlaying(){
    let url = 'https://api.spotify.com/v1/me/player/currently-playing'
    let req = {
      method: 'GET',
      headers: headersData,
      url : url,
    }
    request(req, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('get currently-playing music succes ' + JSON.parse(body).item.name)
        let result = JSON.parse(body).item.name
        io.emit('sendMusiqueName', result)
      } else {
        console.log('ERROR REQUEST: get currently-playing ' + response.statusCode)
      }
    });
  }

});

app.use('/', require('./controllers/connexionController'));
app.use('/salle', require('./controllers/salleController'));


http.listen(8888, function () {
  console.log('Server is listening on *:8888');
});

