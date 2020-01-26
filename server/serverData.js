class ServerData {

  constructor() {
    this.onlineUsers = 0;
  }

  //
  // Handles a new connection being made
  //
  handleConnect(socket) {
    this.onlineUsers++;
  }

  //
  // Handles a socket disconnecting
  //
  handleDisconnect(socket) {
    this.onlineUsers--;
  }

}

// Export class
module.exports = {
  ServerData: ServerData
}