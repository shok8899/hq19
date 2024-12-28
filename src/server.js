const express = require('express');
const WebSocket = require('ws');
const mt4ServerService = require('./services/mt4ServerService');
const serverConfig = require('./config/server');

const app = express();
const port = serverConfig.port;

// Start MT4 server
mt4ServerService.start();

// Create WebSocket server for web clients
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
});

// Attach WebSocket server to HTTP server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});