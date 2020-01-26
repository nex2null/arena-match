//
// DTO that keeps track of an active match
//
class ActiveMatch {

  //
  // Constructor
  //
  constructor(queueRequest1, queueRequest2) {
    this.matchStartTime = Date.now();
    this.matchBegun = false;
    this.queueRequest1 = queueRequest1;
    this.queueRequest2 = queueRequest2;
    this.queueRequest1Accepted = false;
    this.queueRequest2Accepted = false;
  }

  //
  // Notifies each participant their match has been found
  //
  sendMatchFoundEvents() {
    this.queueRequest1.socket.emit('match found', this.queueRequest2.matchNotes);
    this.queueRequest2.socket.emit('match found', this.queueRequest1.matchNotes);
  }

  //
  // Handles the match being accepted
  //
  handleAccept(socket) {

    // Figure out which person accepted
    if (this.queueRequest1.socket == socket) {
      this.queueRequest1Accepted = true;
      this.queueRequest1.socket.emit('match accepted');
      this.queueRequest2.socket.emit('opponent accepted');
    }
    else if (this.queueRequest2.socket == socket) {
      this.queueRequest2Accepted = true;
      this.queueRequest2.socket.emit('match accepted');
      this.queueRequest1.socket.emit('opponent accepted');
    }

    // If both users have accepted then send the match accepted event with the opposing username
    if (this.queueRequest1Accepted && this.queueRequest2Accepted) {
      this.queueRequest1.socket.emit('match begin', this.queueRequest2.username);
      this.queueRequest2.socket.emit('match begin', this.queueRequest1.username);
      this.matchBegun = true;
    }
  }

  //
  // Handles the match being rejected
  //
  handleReject() {

    // Notify each person the match was rejected
    [this.queueRequest1.socket, this.queueRequest2.socket].forEach(
      socket => socket.emit('match rejected'));
  }

  //
  // Handles the match being finished
  //
  handleFinished() {

    // Notify each person the match was finished
    [this.queueRequest1.socket, this.queueRequest2.socket].forEach(
      socket => socket.emit('match finished'));
  }

  //
  // Handles the match timing out
  //
  handleTimeout() {

    // Notify each person the match timed out
    [this.queueRequest1.socket, this.queueRequest2.socket].forEach(
      socket => socket.emit('match timeout'));
  }

  //
  // Determine if this match contains a socket
  //
  containsSocket(socket) {
    return this.queueRequest1.socket == socket || this.queueRequest2.socket == socket;
  }
}

// Export class
module.exports = {
  ActiveMatch: ActiveMatch
}