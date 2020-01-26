//
// DTO that keeps track of a user entering the queue
//
class QueueRequest {

  //
  // Constructor
  //
  constructor(socket, username, format, standardOnly, matchNotes) {
    this.socket = socket;
    this.username = username;
    this.format = format;
    this.standardOnly = standardOnly;
    this.matchNotes = matchNotes;
  }
}

// Export class
module.exports = {
  QueueRequest: QueueRequest
}