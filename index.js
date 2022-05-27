import pkg from './package.json' assert {type: "json"};
import Block from './src/blockchain/block.js';

const main = () => {
  console.log('Hello World');
  console.log(`${pkg.name} v${pkg.version}`);

  const { genesis } = Block;
  console.log(genesis.toString());

  const block = new Block('Data', 'Hash', genesis.hash, Date.now());
  console.log(block.toString());
};

main();
