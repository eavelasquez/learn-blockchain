import WebSocket, { WebSocketServer } from 'ws';

const { P2P_PORT: p2pPort = 5000, PEERS: peersToConnect } = process.env;
const peers = peersToConnect ? peersToConnect.split(',') : [];
const MESSAGE_TYPES = { chain: 'CHAIN' };

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  onConnection(socket) {
    console.log('[ws:socket] connected');
    this.sockets.push(socket);

    socket.on('message', (message) => {
      const { type, value } = JSON.parse(message);

      try {
        switch (type) {
          case MESSAGE_TYPES.chain:
            this.blockchain.replaceChain(value);
            break;
          default:
            console.log(`[ws:socket] unknown message type: ${type}`);
            break;
        }
      } catch (error) {
        console.log(`[ws:message] error ${error.message}`);
      }

      console.group('[ws:message]');
      console.log(`type: ${type} | value:`);
      console.log(value);
      console.groupEnd();
    });

    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        value: this.blockchain.chain,
      })
    );
  }

  listen() {
    const server = new WebSocketServer({ port: p2pPort });
    server.on('connection', (socket) => this.onConnection(socket));

    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.log(`WebSocket server listening on ws://localhost:${p2pPort}`);
  }

  broadcast(type, value) {
    console.log(`[ws:broadcast] type: ${type}...`);

    const message = JSON.stringify({ type, value });
    this.sockets.forEach((socket) => socket.send(message));
  }

  sync() {
    this.broadcast(MESSAGE_TYPES.chain, this.blockchain.chain);
  }
}

export default P2PService;
