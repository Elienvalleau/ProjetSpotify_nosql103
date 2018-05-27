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
let headersData = {Authorization: 'Bearer BQBpFIwy7wNvEGPSZQu08C6p90TmJNgMJ3PgaVeubbzGGs2VXIG-VVyoSOwBfYQifVUv6qIzIWUdGiZNNEggaEIfm-hLqqqh269LlIYbDeYrKw0DS508xm37kqn6QkQRXtYoIVoBQCxMq1tc_Hp1xmn_'}

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
        isMusicPlay = true
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
        isMusicPlay = true
      } else {
        console.log('ERROR REQUEST: next ' + response.statusCode)
      }
    });
  })

  //Gestion de la fonction next
  socket.on('searchMusic' , async function(search) {
    getSearchMusic(search.text, 'track').then(function(res){    
      playMusic(res[0], res[1])
    })
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

  //Fait une recherche et renvoie l'album et la position 
  function getSearchMusic(q, type){
    return new Promise((resolve, reject) => {
      let url = 'https://api.spotify.com/v1/search?q=' + q + '&type=' + type + '&limit=1'
      let req = {
        method: 'GET',
        headers: headersData,
        url : url,
      }
      request(req, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('get search music succes ' + JSON.parse(body).tracks.items[0].album.uri + ' offset ' + JSON.parse(body).tracks.items[0].track_number -1)
          let result = [JSON.parse(body).tracks.items[0].album.uri, JSON.parse(body).tracks.items[0].track_number -1]
          resolve(result)
        } else {
          console.log('ERROR REQUEST: get search music ' + response.statusCode)
        }
      });
    })
  }

  //Lance une musique en fonction de l'uri de l'album et de sa position
  function playMusic(uriAlbum,offset){
    let url = 'https://api.spotify.com/v1/me/player/play' 
    let req = {
      method: 'PUT',
      headers: headersData,
      body: JSON.stringify({
        context_uri: uriAlbum,
        offset: {position: offset}
      }),
      url : url,
    }
    request(req, function (error, response, body) {
      if (!error && response.statusCode == 204) {
        console.log('Music Switch by ' + socket.id)
        io.emit('chat-message', {text: 'Music Switch by ' + socket.id})
        setTimeout(getMusicPlaying, 500);
        isMusicPlay = true
      } else{
        console.log('ERROR REQUEST: set playMusic ' + response.statusCode)
      }
    });
  }
});

app.use('/', require('./controllers/connexionController'));
app.use('/salle', require('./controllers/salleController'));


http.listen(8888, function () {
    console.log('Server is listening on *:8888');
});

