const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer, WebSocket } = require('ws');

const { PORT, CLIENT_ORIGIN } = require('./config');
const store = require('./store/binStore');
const driverStore = require('./store/driverStore');
const createRouter = require('./routes');
const { createMessageHandler } = require('./ws/handlers');

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use('/api', createRouter());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(message) {
  const payload = typeof message === 'string' ? message : JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

let nextConnectionId = 1;

wss.on('connection', (ws) => {
  const connectionId = nextConnectionId++;
  console.log(`Client connected (#${connectionId})`);

  store.getAll().forEach((bin) => {
    ws.send(JSON.stringify(bin));
  });

  driverStore.getAll().forEach((driver) => {
    ws.send(JSON.stringify(driver));
  });

  const handleMessage = createMessageHandler(broadcast, connectionId);
  ws.on('message', (message) => handleMessage(ws, message.toString()));
  ws.on('close', () => {
    driverStore.remove(connectionId);
    broadcast({ type: 'driverleave', id: connectionId });
    console.log(`Client disconnected (#${connectionId})`);
  });
});

server.listen(PORT, () => {
  console.log(`EcoTrack server running on http://localhost:${PORT}`);
  console.log('WebSocket server is ready');
});

process.on('SIGINT', () => {
  console.log('Server shutting down');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
