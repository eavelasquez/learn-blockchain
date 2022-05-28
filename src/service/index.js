import express from 'express';
import bodyParser from 'body-parser';

const { port = 3000 } = process.env;

const app = express();

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

app.listen(port, () => {
  console.log(`HTTP server listening on http://localhost:${port}`);
});
