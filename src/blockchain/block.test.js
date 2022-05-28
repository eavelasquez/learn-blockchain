import Block from './block.js';

describe('Block class', () => {
  let data, hash, previousBlock, timestamp;

  beforeEach(() => {
    data = 'Block data';
    hash = '0';
    previousBlock = Block.genesis;
    timestamp = 1465154705;
  });

  it('should create a new block', () => {
    const { hash: previousHash } = previousBlock;
    const block = new Block(data, hash, previousHash, timestamp);

    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
    expect(block.previousHash).toEqual(previousHash);
    expect(block.timestamp).toEqual(timestamp);
  });

  it('should create a genesis block', () => {
    const block = Block.genesis;

    expect(block.data).toEqual('Genesis Block');
    expect(block.hash).toEqual('0');
    expect(block.previousHash).toEqual('');
    expect(block.timestamp).toEqual(1465154705);
  });

  it('should create a new hash', () => {
    const hash = Block.hash(data, previousBlock.hash, timestamp);
    const expectedHash =
      '6c055383fb413270edf306cfb41912c04fe7374dc1f0c6eae4a1729e4fbe535c';

    expect(hash).toEqual(expectedHash);
  });

  it('should mine a new block', () => {
    const block = Block.mine(previousBlock, `${data} - 1`);

    expect(block.data).toEqual(`${data} - 1`);
    expect(block.hash.length).toEqual(64);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.timestamp).toBeGreaterThan(previousBlock.timestamp);
  });

  it('should return a string representation of the block', () => {
    const block = new Block(data, hash, previousBlock.hash, timestamp);
    const result = block.toString();

    expect(typeof result).toEqual('string');
    expect(result).toEqual(`Block -
      data: ${data}
      hash: ${hash}
      previousHash: ${previousBlock.hash}
      timestamp: ${timestamp}
    `);
  });
});
