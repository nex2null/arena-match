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
var serverData = new ServerData(io);

// Handle socket.io connections and register event handlers
io.on('connection', function (socket) {

  // Register the connection
  serverData.handleConnect(socket);

  // Handle disconnect event
  socket.on('disconnect', function () {
    serverData.handleDisconnect(socket);
  });

  // Handle a match being created
  socket.on('create match', function (matchArgs) {

    // Make sure match notes aren't too long
    if (matchArgs.matchNotes && matchArgs.matchNotes.length > 50)
      return;

    // Create the match
    serverData.handleMatchCreate(socket, matchArgs);
  });

  // Handle a match being cancelled
  socket.on('cancel match', function () {
    serverData.handleMatchCancel(socket);
  });

  // Handle a match being joined
  socket.on('join match', function (joinArgs) {
    serverData.handleMatchJoin(socket, joinArgs.matchId, joinArgs.username);
  })

  // Handle match accepted event
  socket.on('accept match', function () {
    serverData.handleMatchAccepted(socket);
  });

  // Handle match rejected event
  socket.on('reject match', function () {
    serverData.handleMatchRejected(socket);
  });

  // Handle match finished event
  socket.on('finish match', function () {
    serverData.handleMatchFinished(socket);
  });
});

// Process every 15 seconds
setInterval(function () {
  io.emit('online users', serverData.connectedSockets.length);
  serverData.doMatchSync();
  serverData.processMatchTimeouts();
  serverData.cleanUpDisconnects();
}, 15 * 1000);

// Start listening
http.listen(80, function () {
  console.log('Server started.');
});