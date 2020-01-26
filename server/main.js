// Imports
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var ServerData = require('./serverData.js').ServerData;

// Setup expess to serve client app
const staticFileMiddleware = express.static('dist');
app.use(staticFileMiddleware);

// Instantiate server data
var serverData = new ServerData();

// Handle socket.io connections and register event handlers
io.on('connection', function (socket) {

  // Register the connection
  serverData.handleConnect(socket);

  // Handle disconnect event
  socket.on('disconnect', function () {
    serverData.handleDisconnect(socket);
  })
});

// Emit the number of online users every 5 seconds
setInterval(function () {
  io.emit('online users', serverData.onlineUsers);
}, 5 * 1000);

// Start listening
http.listen(80, function () {
  console.log('Server started.');
});