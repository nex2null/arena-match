// Imports
var _ = require('lodash');
var QueueRequest = require('./queueRequest').QueueRequest;
var ActiveMatch = require('./activeMatch').ActiveMatch;

//
// Handles server data and matchmaking processing
//
class ServerData {

  //
  // Constructor
  //
  constructor() {
    this.connectedSockets = [];
    this.queueRequests = [];
    this.activeMatches = [];
  }

  //
  // Handles a new connection being made
  //
  handleConnect(socket) {
    this.connectedSockets.push(socket);
    socket.emit('online users', this.connectedSockets.length);
  }

  //
  // Handles a socket disconnecting
  //
  handleDisconnect(socket) {
    _.pull(this.connectedSockets, socket);
    this.handleDequeue(socket);
  }

  //
  // Handles a client queueing
  //
  handleQueue(socket, args) {

    // Make sure we don't currently have this socket queued
    if (this.queueRequests.find(x => x.socket == socket))
      return;

    // Create a new queue request
    var queueRequest = new QueueRequest(
      socket,
      args.username,
      args.format,
      args.standardOnly,
      args.matchNotes);

    // Add to the active requests
    this.queueRequests.push(queueRequest);

    // Mark that the socket is queued
    socket.emit('queued');
  }

  //
  // Handles a client dequeueing
  //
  handleDequeue(socket) {

    // If there was a queue request for the socket, remove it
    var queueRequest = this.queueRequests.find(x => x.socket == socket);
    if (queueRequest) {
      queueRequest.socket.emit('dequeued');
      _.pull(this.queueRequests, queueRequest);
    }

    // If there was a match for the socket, reject it
    this.handleMatchRejected(socket);
  }

  //
  // Handles a match being accepted
  //
  handleMatchAccepted(socket) {

    var activeMatch = this.activeMatches.find(x => x.containsSocket(socket));
    if (activeMatch)
      activeMatch.handleAccept(socket);
  }

  //
  // Handles a match being rejected
  //
  handleMatchRejected(socket) {

    var activeMatch = this.activeMatches.find(x => x.containsSocket(socket));
    if (activeMatch) {
      activeMatch.handleReject();
      _.pull(this.activeMatches, activeMatch);
    }
  }

  //
  // Handles a match being finished
  //
  handleMatchFinished(socket) {

    var activeMatch = this.activeMatches.find(x => x.containsSocket(socket));
    if (activeMatch) {
      activeMatch.handleFinished();
      _.pull(this.activeMatches, activeMatch);
    }
  }

  //
  // Processes matchmaking
  //
  processMatchmaking() {

    // Keep track of the processed requests
    var processedRequests = [];

    // Loop through all the queue requests and try to find its match
    this.queueRequests.forEach(queueRequest => {

      // If this request has aleady been processed then skip
      if (processedRequests.includes(queueRequest))
        return;

      // Find a queue request matching the standard only flag, and format
      // that isn't the queue request we are currently looking for
      var opponentQueueRequest = this.queueRequests.find(x =>
        !processedRequests.includes(x) &&
        x.format == queueRequest.format &&
        x.standardOnly == queueRequest.standardOnly &&
        x != queueRequest);

      // If we found an opponent then process the match
      if (opponentQueueRequest) {

        // Create the match and send starting events
        var activeMatch = new ActiveMatch(queueRequest, opponentQueueRequest);
        activeMatch.sendMatchFoundEvents();
        this.activeMatches.push(activeMatch);

        // Mark that each request has been processed
        processedRequests.push(queueRequest);
        processedRequests.push(opponentQueueRequest);
      }
    });

    // Remove queue requests for all processed requests
    processedRequests.forEach(x => _.pull(this.queueRequests, x));
  }

  //
  // Processes match timeouts
  //
  processMatchTimeouts() {

    // Grab the timed out matches
    var currentTime = Date.now();
    var timeOutInSeconds = 60;
    var timedOutMatches = this.activeMatches.filter(x =>
      !x.matchBegun &&
      (currentTime - x.matchStartTime) > (timeOutInSeconds * 1000));

    // Send the timeout events
    timedOutMatches.forEach(x => x.handleTimeout());

    // Remove the timed out matches
    timedOutMatches.forEach(x => _.pull(this.activeMatches, x));
  }
}

// Export class
module.exports = {
  ServerData: ServerData
}