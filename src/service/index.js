import express from 'express';
import bodyParser from 'body-parser';

import Blockchain from '../blockchain/index.js';
import Miner from '../miner/index.js';
import P2PService, { MESSAGE_TYPES } from './p2p.js';
import Wallet from '../wallet/index.js';

const { HTTP_PORT: httpPort = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const p2pService = new P2PService(blockchain);
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const miner = new Miner({
  blockchain,
  p2pService,
  wallet: walletMiner,
});

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log('⬅️ ', req.method, req.path, req.body || req.query);
  next();
});

// curl -X GET http://localhost:3000/healthcheck
app.get('/healthcheck', (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
  };

  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

// curl -X GET http://localhost:3000/blocks
app.get('/blocks', (req, res) => res.json(blockchain.chain));

// curl -X POST -H "Content-Type: application/json" http://localhost:3000/wallet
app.post('/wallet', (req, res) => {
  const { publicKey } = new Wallet(blockchain);
  res.json({ publicKey });
});

// curl -X GET http://localhost:3000/transactions
app.get('/transactions', (_req, res) => {
  const {
    memoryPool: { transactions },
  } = blockchain;
  res.json(transactions);
});

// curl -X POST -H "Content-Type: application/json" -d '{"recipientAddress": "random-address", "amount": 5}' http://localhost:3000/transaction
app.post('/transaction', (req, res) => {
  const {
    body: { recipientAddress, amount },
  } = req;

  try {
    const txn = wallet.createTransaction({ recipientAddress, amount });
    p2pService.broadcast(MESSAGE_TYPES.transaction, txn);
    res.json(txn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// curl -X GET http://localhost:3000/mine/transactions
app.get('/mine/transactions', (_req, res) => {
  try {
    miner.mine();
    res.redirect('/blocks');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(httpPort, () => {
  console.log(`HTTP server listening on http://localhost:${httpPort}`);
  p2pService.listen();
});
