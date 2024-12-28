const net = require('net');
const config = require('../config/server');
const binanceService = require('./binanceService');
const socketManager = require('./socketManager');
const priceManager = require('./priceManager');

class MT4ServerService {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = net.createServer(this.handleConnection.bind(this));

    this.server.listen(config.mt4Server.port, () => {
      console.log(`MT4 server listening on port ${config.mt4Server.port}`);
    });

    this.startPriceStream();
  }

  handleConnection(socket) {
    console.log('MT4 client connected');
    const clientId = socketManager.addClient(socket);

    socket.on('data', (data) => {
      this.handleClientRequest(clientId, data);
    });

    socket.on('close', () => {
      console.log('MT4 client disconnected');
      socketManager.removeClient(clientId);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socketManager.removeClient(clientId);
    });

    this.sendSymbolsInfo(clientId);
  }

  handleClientRequest(clientId, data) {
    try {
      const request = data.toString();
      if (request.startsWith('QUOTE')) {
        const symbol = request.split(' ')[1];
        const price = priceManager.getPrice(symbol);
        if (price) {
          socketManager.sendToClient(clientId, {
            type: 'price',
            symbol,
            ...price
          });
        }
      }
    } catch (error) {
      console.error('Error handling client request:', error);
    }
  }

  sendSymbolsInfo(clientId) {
    const symbolsInfo = config.mt4Server.symbols.map(symbol => {
      const price = priceManager.getPrice(symbol.name) || { bid: 0, ask: 0 };
      return { ...symbol, ...price };
    });

    socketManager.sendToClient(clientId, {
      type: 'symbols',
      data: symbolsInfo
    });
  }

  startPriceStream() {
    binanceService.startPriceStream((symbol, price) => {
      const mt4Symbol = priceManager.updatePrice(symbol, price);
      socketManager.broadcast({
        type: 'price',
        symbol: mt4Symbol,
        ...priceManager.getPrice(mt4Symbol)
      });
    });
  }
}

module.exports = new MT4ServerService();