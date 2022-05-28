import Block from './block.js';
import Blockchain from './blockchain.js';

describe('Blockchain class', () => {
  let blockchain;
  let newBlockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newBlockchain = new Blockchain();
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

  it('should be able to replace the chain with a valid chain', () => {
    newBlockchain.addBlock('Block 1');

    blockchain.replaceChain(newBlockchain.chain);

    expect(blockchain.chain).toEqual(newBlockchain.chain);
  });

  it('should not replace the chain with an chain less than the current chain', () => {
    blockchain.addBlock('Block 1');

    expect(() => {
      blockchain.replaceChain(newBlockchain.chain);
    }).toThrowError('The incoming chain must be longer');
  });

  it('should not replace the chain with an invalid chain', () => {
    newBlockchain.addBlock('Block 1');
    newBlockchain.chain[1].data = 'Invalid data';

    expect(() => {
      blockchain.replaceChain(newBlockchain.chain);
    }).toThrowError('The incoming chain is invalid');
  });
});
