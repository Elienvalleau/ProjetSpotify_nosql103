const socket = io();
const messages = document.getElementById('listMessages');
const url = document.location.href;

var musiquePlaying = 'Patate';

$('.h1').append($('<h1>').text(url.substr(22).slice(0, -1).replace(/%20/i, ' ')));

$('#chat form').submit(function (e) {
  e.preventDefault();
  const message = {
    text : $('#m').val()
  };
  $('#m').val('');
  if (message.text.trim().length !== 0) {
    socket.emit('chat-message', message);
  }
  $('#chat input').focus();
});


socket.on('chat-message', function (message) {
  $('#messages').append($('<li class="message">').text(message.text));
  messages.scrollTop = messages.scrollHeight;
});

socket.on('arrayCo', function (idCo) {
  $("#listUsers").text('Utilisateurs :' + idCo.length +' \n ' + idCo)
});

socket.on('sendMusiqueName', function (musiqueName) {
  $("#musiqueName").text('Musique : ' + musiqueName)
});

previous.onclick = function() {
  socket.emit('previous')
};

playPause.onclick = function() {
  socket.emit('playPause')
};

next.onclick = function() {
  socket.emit('next')
};

$('#right form').submit(function (e) {
  e.preventDefault();
  const search = {text : $('#searchMusic').val()};
  $('#searchMusic').val('');
  if (search.text.trim().length !== 0) {
    socket.emit('searchMusic', search);
  }
  $('#right input').focus();
});
