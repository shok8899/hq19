const net = require('net');

class SocketManager {
  constructor() {
    this.clients = new Map();
  }

  addClient(socket) {
    const clientId = Date.now().toString();
    this.clients.set(clientId, socket);
    return clientId;
  }

  removeClient(clientId) {
    this.clients.delete(clientId);
  }

  broadcast(message) {
    for (const socket of this.clients.values()) {
      if (socket.writable) {
        socket.write(JSON.stringify(message));
      }
    }
  }

  sendToClient(clientId, message) {
    const socket = this.clients.get(clientId);
    if (socket && socket.writable) {
      socket.write(JSON.stringify(message));
    }
  }
}

module.exports = new SocketManager();