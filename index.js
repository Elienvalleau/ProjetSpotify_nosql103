var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var pug = require('pug');

app.set('view engine', 'pug');

app.get('/', function(req, res){
  res.render("C:/Users/Wakfu/Documents/ProjetSpotify_nosql103/views/main.pug");
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  })
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});