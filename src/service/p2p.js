import WebSocket from 'ws';

const { p2pPort = 5000, peersToConnect } = process.env;
const peers = peersToConnect ? peersToConnect.split(',') : [];

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  onConnection(socket) {
    this.sockets.push(socket);
    console.log('[ws:socket] connected');
  }

  listen() {
    const server = new WebSocket.Server({ port: p2pPort });
    server.on('connection', (socket) => this.onConnection(socket));

    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.log(`Listening for peer-to-peer connections on: ${p2pPort}`);
  }
}

export default P2PService;
