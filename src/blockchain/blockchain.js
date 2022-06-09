import Block from './block.js';
import validate from './modules/validate.js';
import MemoryPool from './memory-pool.js';

class Blockchain {
  constructor() {
    this.chain = [Block.genesis];
    this.memoryPool = new MemoryPool();
  }

  addBlock(data) {
    const block = Block.mine(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  replaceChain(newChain = []) {
    if (newChain.length < this.chain.length) {
      throw Error('The incoming chain must be longer.');
    }

    try {
      validate(newChain);
    } catch (error) {
      throw Error('The incoming chain is invalid.');
    }

    this.chain = newChain;

    return this.chain;
  }
}

export default Blockchain;
