// Imports
var _ = require('lodash');
var Match = require('./Match').Match;

//
// Handles server data and matchmaking processing
//
class ServerData {

  //
  // Constructor
  //
  constructor(io) {
    this.io = io;
    this.connectedSockets = [];
    this.matches = [];
  }

  //
  // Handles a new connection being made
  //
  handleConnect(socket) {
    this.connectedSockets.push(socket);
    socket.emit('online users', this.connectedSockets.length);
    //socket.emit('sync all matches', this.getPendingMatches());
  }

  //
  // Handles a socket disconnecting
  //
  handleDisconnect(socket) {
    _.pull(this.connectedSockets, socket);

    // Kill anything that socket may have been doing
    this.handleMatchCancel(socket);
  }

  //
  // Handles a match being created
  //
  handleMatchCreate(socket, matchArgs) {

    // Make sure we don't already have a match with this socket in it
    if (this.matches.find(x => x.containsSocket(socket)))
      return;

    // Create a new match
    var match = new Match(
      socket,
      matchArgs.username,
      matchArgs.format,
      matchArgs.standardOnly,
      matchArgs.matchNotes);

    // Add to the active matches
    this.matches.push(match);

    // Mark to the user their match has been created
    socket.emit('match created', match.id);

    // Broadcast the match add
    this.io.emit('add match', match.toBroadcastFormat());
  }

  //
  // Handles a match being cancelled
  //
  handleMatchCancel(socket) {

    // Find the match
    var match = this.matches.find(x => x.createdBySocket(socket));
    if (!match)
      return;

    // If the match cannot be cancelled then do nothing
    if (!match.canBeCancelled())
      return;

    // Remove the match from the list of matches
    _.pull(this.matches, match);

    // Let the user know the match has been cancelled
    socket.emit('match cancelled');

    // Broadcast the match remove
    this.io.emit('remove match', match.id);
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

  //
  // Syncs all matches in case clients didn't receive one
  //
  doMatchSync() {
    this.io.emit('sync all matches', this.getPendingMatches());
  }

  //
  // Gets the pending matches
  //
  getPendingMatches() {

    // Grab all the pending matches
    var pendingMatches = this.matches.filter(x => !x.matchBegun);

    // Return them in their broadcast form
    return pendingMatches.map(x => x.toBroadcastFormat());
  }
}

// Export class
module.exports = {
  ServerData: ServerData
}