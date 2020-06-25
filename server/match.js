const uuid = require('uuid/v4');

//
// DTO that keeps track of a match
//
class Match {

  //
  // Constructor
  //
  constructor(hostSocket, hostUsername, format, standardOnly, matchNotes) {
    this.id = uuid();
    this.hostSocket = hostSocket;
    this.hostUsername = hostUsername;
    this.format = format;
    this.standardOnly = standardOnly;
    this.matchNotes = matchNotes;
    this.opponentSocket = null;
    this.opponentUsername = null;
    this.opponentJoinedTime = null;
    this.hostAccepted = false;
    this.opponentAccepted = false;
    this.joinEnabled = true;
    this.matchBegun = false;
  }

  //
  // Handles the match being joined
  //
  handleJoin(io, opponentSocket, opponentUsername) {

    // If this match has already been joined then do nothing
    if (this.opponentSocket != null)
      return;

    // Set the opponent
    this.opponentSocket = opponentSocket;
    this.opponentUsername = opponentUsername;
    this.opponentJoinedTime = Date.now();

    // Send the match joined event to both sockets
    [this.hostSocket, this.opponentSocket].forEach(socket =>
      socket.emit('match joined'));

    // Broadcast that the match is not able to be joined
    this.joinEnabled = false;
    io.emit('disable match join', this.id);
  }

  //
  // Handles the match being accepted
  //
  handleAccept(io, socket) {

    // Figure out which person accepted
    if (this.hostSocket == socket) {
      this.hostAccepted = true;
      this.hostSocket.emit('match accepted');
      this.opponentSocket.emit('opponent accepted');
    }
    else if (this.opponentSocket == socket) {
      this.opponentAccepted = true;
      this.opponentSocket.emit('match accepted');
      this.hostSocket.emit('opponent accepted');
    }

    // If both users have accepted then handle match begin
    if (this.hostAccepted && this.opponentAccepted) {
      this.handleBegin(io);
    }
  }

  //
  // Handles the match beginning
  //
  handleBegin(io) {

    // Send the match begun events
    this.matchBegun = true;
    this.hostSocket.emit('match begin', this.opponentUsername);
    this.opponentSocket.emit('match begin', this.hostUsername);

    // Remove this match from the matches list
    io.emit('remove match', this.id);
  }

  //
  // Handles the match being rejected
  //
  handleReject(io) {

    // Notify each person the match was rejected
    [this.hostSocket, this.opponentSocket].forEach(
      socket => socket.emit('match rejected'));

    // Reset the match
    this.resetMatch(io);
  }

  //
  // Handles the match being finished
  //
  handleFinished() {

    // Notify each person the match was finished
    [this.hostSocket, this.opponentSocket].forEach(
      socket => socket.emit('match finished'));
  }

  //
  // Handles the match timing out
  //
  handleTimeout(io) {

    // Notify each person the match timed out
    [this.hostSocket, this.opponentSocket].forEach(
      socket => socket.emit('match timeout'));

    // Reset the match
    this.resetMatch(io);
  }

  //
  // Resets the match back to its start state
  //
  resetMatch(io) {

    // Set the match properties
    this.opponentSocket = null;
    this.opponentUsername = null;
    this.opponentJoinedTime = null;
    this.hostAccepted = false;
    this.opponentAccepted = false;
    this.joinEnabled = true;
    this.matchBegun = false;

    // Broadcast that the match is eligible to be joined
    io.emit('enable match join', this.id);
  }

  //
  // Determine if this match contains a socket
  //
  containsSocket(socket) {
    return this.hostSocket == socket || this.opponentSocket == socket;
  }

  //
  // Determine if a socket created the match
  //
  createdBySocket(socket) {
    return this.hostSocket == socket;
  }

  //
  // Determine if this match can be joined
  //
  canBeJoined(socket) {
    return this.opponentSocket == null && this.hostSocket != socket;
  }

  //
  // Gets the broadcast format of this match
  //
  toBroadcastFormat() {
    return {
      id: this.id,
      format: this.format,
      matchNotes: this.matchNotes,
      standardOnly: this.standardOnly,
      joinEnabled: this.joinEnabled
    };
  }
}

// Export class
module.exports = {
  Match: Match
}