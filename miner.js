import Blockchain from './src/blockchain/index.js';

const blockchain = new Blockchain();

for (let i = 0; i < 10; i += 1) {
  const block = blockchain.addBlock(`Block data ${i}`);
  console.log(block.toString());
}
