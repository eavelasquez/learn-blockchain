import pkg from './package.json' assert {type: "json"};
import Block from './src/blockchain/block.js';

const main = () => {
  console.log('Hello World');
  console.log(`${pkg.name} v${pkg.version}`);

  const block = new Block('Data', 'Hash', 'Previous Hash', Date.now());
  console.log(block.toString());
};

main();
