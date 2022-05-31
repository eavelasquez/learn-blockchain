import express from 'express';
import bodyParser from 'body-parser';

import Blockchain from '../blockchain/index.js';
import P2PService from './p2p.js';

const { HTTP_PORT: httpPort = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const p2pService = new P2PService(blockchain);

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log('⬅️ ', req.method, req.path, req.body ?? req.query);
  next();
});

// curl -X GET http://localhost:3000/health
app.get('/health', (_req, res) => res.send('OK'));

// curl -X GET http://localhost:3000/blocks
app.get('/blocks', (_req, res) => res.send(blockchain.chain));

// curl -X POST -H "Content-Type: application/json" -d '{"data": "Block 1"}' http://localhost:3000/mine
app.post('/mine', (req, res) => {
  const { body: { data } } = req;
  const block = blockchain.addBlock(data);

  p2pService.sync();

  res.json({
    block,
    message: 'New block added',
    totalBlocks: blockchain.chain.length,
  });
});

app.listen(httpPort, () => {
  console.log(`HTTP server listening on http://localhost:${httpPort}`);
  p2pService.listen();
});
