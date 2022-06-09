import pkg from './package.json' assert {type: "json"};
import { Block } from './src/blockchain/index.js';

const main = () => {
  console.log('Hello World');
  console.log(`${pkg.name} v${pkg.version}`);

  const { genesis } = Block;
  console.log(genesis.toString());

  const block1 = Block.mine(genesis, 'Block 1');
  console.log(block1.toString());

  const block2 = Block.mine(block1, 'Block 2');
  console.log(block2.toString());
};

main();
