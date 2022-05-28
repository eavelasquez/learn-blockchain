import Block from './block.js';
import Blockchain from './blockchain.js';

describe('Blockchain class', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('should be have a genesis block', () => {
    const [genesis] = blockchain.chain;

    expect(genesis).toEqual(Block.genesis);
    expect(blockchain.chain.length).toEqual(1);
  });

  it('should be able to add a new block', () => {
    const data = 'Block data 1';
    const block = blockchain.addBlock(data);

    expect(block.data).toEqual(data);
    expect(blockchain.chain.length).toEqual(2);
    expect(block.previousHash).toEqual(Block.genesis.hash);
  });
});
