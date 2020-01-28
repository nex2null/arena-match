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
  handleJoin(opponentSocket, opponentUsername) {

    // If this match has already been joined then do nothing
    if (this.opponentSocket != null)
      return false;

    // Set the opponent
    this.opponentSocket = opponentSocket;
    this.opponentUsername = opponentUsername;
    this.opponentJoinedTime = Date.now();

    // Send the match joined event to both sockets
    [this.hostSocket, this.opponentSocket].forEach(socket =>
      socket.emit('match joined'));

    return true;
  }

  //
  // Handles the match being accepted
  //
  handleAccept(socket) {

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

    // If both users have accepted then send the match accepted event with the opposing username
    if (this.hostAccepted && this.opponentAccepted) {
      this.hostSocket.emit('match begin', this.opponentUsername);
      this.opponentSocket.emit('match begin', this.hostUsername);
      this.matchBegun = true;
    }
  }

  //
  // Handles the match being rejected
  //
  handleReject() {

    // Notify each person the match was rejected
    [this.hostSocket, this.opponentSocket].forEach(
      socket => socket.emit('match rejected'));
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
  handleTimeout() {

    // Notify each person the match timed out
    [this.hostSocket, this.opponentSocket].forEach(
      socket => socket.emit('match timeout'));
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
  // Determine if this match can be cancelled
  //
  canBeCancelled() {
    return this.opponentSocket == null;
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