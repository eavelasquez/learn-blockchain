import Block from './block.js';

class Blockchain {
  constructor() {
    this.chain = [Block.genesis];
  }

  addBlock(data) {
    const block = Block.mine(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }
}

export default Blockchain;
