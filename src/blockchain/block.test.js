import Block from './block.js';
import { DIFFICULTY } from './block.js';

describe('Block class', () => {
  let data, difficulty, hash, nonce, previousBlock, timestamp;

  beforeEach(() => {
    data = 'Block data';
    difficulty = DIFFICULTY;
    hash = '0';
    nonce = 128;
    previousBlock = Block.genesis;
    timestamp = 1465154705;
  });

  it('should create a new block', () => {
    const { hash: previousHash } = previousBlock;
    const block = new Block({ data, nonce, hash, previousHash, timestamp });

    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
    expect(block.nonce).toEqual(nonce);
    expect(block.previousHash).toEqual(previousHash);
    expect(block.timestamp).toEqual(timestamp);
  });

  it('should create a genesis block', () => {
    const block = Block.genesis;

    expect(block.data).toEqual('Genesis Block');
    expect(block.hash).toEqual('0');
    expect(block.previousHash).toEqual('0');
    expect(block.timestamp).toEqual(1465154705);
  });

  it('should create a new hash', () => {
    const { hash: previousHash } = previousBlock;
    const hash = Block.hash({ data, nonce, previousHash, timestamp });
    const expectedHash =
      'c45347ab5e7d44b002c440318c3917aca577d465f2275fdde0e78e553f9870b1';

    expect(hash).toEqual(expectedHash);
  });

  it('should mine a new block', () => {
    const block = Block.mine(previousBlock, `${data} - 1`);

    expect(block.data).toEqual(`${data} - 1`);
    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    expect(block.nonce).toBeGreaterThan(0);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.timestamp).toBeGreaterThan(previousBlock.timestamp);
  });

  it('should return a string representation of the block', () => {
    const block = Block.mine(previousBlock, data);
    const result = block.toString();

    expect(result).toMatch(/Block -/);
    expect(typeof result).toEqual('string');
  });
});
