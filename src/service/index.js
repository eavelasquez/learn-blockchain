import express from 'express';
import bodyParser from 'body-parser';

import Blockchain from '../blockchain/index.js';

const { port = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();

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

app.get('/health', (_req, res) => res.send('OK'));
app.get('/blocks', (_req, res) => res.send(blockchain.chain));
app.post('/mine', (req, res) => {
  const { body: { data } } = req;
  const block = blockchain.addBlock(data);
  res.json({
    block,
    message: 'New block added',
    totalBlocks: blockchain.chain.length,
  });
});

app.listen(port, () => {
  console.log(`HTTP server listening on http://localhost:${port}`);
});
