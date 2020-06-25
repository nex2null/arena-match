// Imports
var _ = require('lodash');
var Match = require('./match').Match;

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
    this.begunMatches = [];
  }

  //
  // Handles a new connection being made
  //
  handleConnect(socket) {
    this.connectedSockets.push(socket);
    socket.emit('online users', this.connectedSockets.length);
    socket.emit('sync all matches', this.getPendingMatches());
  }

  //
  // Handles a socket disconnecting
  //
  handleDisconnect(socket) {
    _.pull(this.connectedSockets, socket);

    // Kill anything that socket may have been doing
    this.handleMatchCancel(socket);
    this.handleMatchRejected(socket);
    this.handleMatchFinished(socket);
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

    // If the match has an opponent then reject it
    if (match.opponentSocket != null)
      match.handleReject(this.io);

    // Remove the match from the list of matches
    _.pull(this.matches, match);

    // Let the user know the match has been cancelled
    socket.emit('match cancelled');

    // Broadcast the match remove
    this.io.emit('remove match', match.id);
  }

  //
  // Handles a match being joined
  //
  handleMatchJoin(socket, matchId, username) {

    // If the user has created a match they can't join another
    var currentMatch = this.matches.find(x => x.createdBySocket(socket));
    if (currentMatch)
      return;

    // Find the match
    var match = this.matches.find(x => x.id == matchId);
    if (!match)
      return;

    // Ensure it can be joined
    if (!match.canBeJoined(socket))
      return;

    // Join the match
    match.handleJoin(this.io, socket, username);
  }

  //
  // Handles a match being accepted
  //
  handleMatchAccepted(socket) {

    // Grab the match
    var match = this.matches.find(x => x.containsSocket(socket));
    if (!match)
      return;

    // Handle the match accept
    match.handleAccept(this.io, socket);

    // If the match began, then move it to the begun matches list
    if (match.matchBegun) {
      _.pull(this.matches, match);
      this.begunMatches.push(match);
    }
  }

  //
  // Handles a match being rejected
  //
  handleMatchRejected(socket) {

    var match = this.matches.find(x => x.containsSocket(socket));
    if (match) {
      match.handleReject(this.io);
    }
  }

  //
  // Handles a match being finished
  //
  handleMatchFinished(socket) {

    var match = this.begunMatches.find(x => x.containsSocket(socket));
    if (match) {
      match.handleFinished();
      _.pull(this.begunMatches, match);
    }
  }

  //
  // Processes match timeouts
  //
  processMatchTimeouts() {

    // Grab the timed out matches
    var currentTime = Date.now();
    var timeout = 45 * 1000;
    var timedOutMatches = this.matches.filter(x =>
      !x.matchBegun &&
      x.opponentJoinedTime != null &&
      (currentTime - x.opponentJoinedTime) > timeout);

    // Send the timeout events
    timedOutMatches.forEach(x => x.handleTimeout(this.io));
  }

  //
  // Clean up disconnected matches, just in case
  //
  cleanUpDisconnects() {

    // Get all matches with a disconnected host
    var disconnectedMatches = this.matches.filter(x => !x.hostSocket.connected);

    // Cancel every match that has disconnected
    disconnectedMatches.forEach(x => this.handleMatchCancel(x.hostSocket));
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