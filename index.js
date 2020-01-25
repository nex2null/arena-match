var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const staticFileMiddleware = express.static('dist');

app.use(staticFileMiddleware);

var pageData = {
  onlineUsers: 0
}

io.on('connection', function (socket) {

  console.log('connected');

  var username = '';

  socket.on('login', function (name) {
    if (!name) return;
    username = name;
    pageData.onlineUsers++;
    socket.emit('logged in');
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', username + ': ' + msg);
  });

  socket.on('disconnect', function () {
    if (username) {
      console.log('disconnected');
      pageData.onlineUsers--;
    }
  })
});

setInterval(function () {
  io.emit('online users', pageData.onlineUsers);
}, 5000);

http.listen(80, function () {
  console.log('listening on *:80');
});