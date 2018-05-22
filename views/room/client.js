const socket = io();
const messages = document.getElementById('listMessages');


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