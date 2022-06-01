import Block from './block.js';
import { DIFFICULTY } from './block.js';

describe('Block class', () => {
  let data, hash, nonce, previousBlock, timestamp;

  beforeEach(() => {
    data = 'Block data';
    hash = '0';
    nonce = 128;
    previousBlock = Block.genesis;
    timestamp = 1465154705;
  });

  it('should create a new block', () => {
    const { hash: previousHash } = previousBlock;
    const block = new Block(data, hash, previousHash, timestamp, nonce);

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
    expect(block.previousHash).toEqual('');
    expect(block.timestamp).toEqual(1465154705);
  });

  it('should create a new hash', () => {
    const hash = Block.hash(data, previousBlock.hash, timestamp, nonce);
    const expectedHash =
      '8417bd39f766d1d59a7fcb8dbe506cc8b527718cba31a79ec4c3b9cc10773531';

    expect(hash).toEqual(expectedHash);
  });

  it('should mine a new block', () => {
    const block = Block.mine(previousBlock, `${data} - 1`);

    expect(block.data).toEqual(`${data} - 1`);
    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
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
