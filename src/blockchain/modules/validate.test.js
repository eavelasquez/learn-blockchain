import Blockchain from '../blockchain.js';
import validate from './validate.js';

describe('validate module', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('should be able to validate a valid chain', () => {
    blockchain.addBlock('Block 1');
    blockchain.addBlock('Block 2');

    expect(validate(blockchain.chain)).toBe(true);
  });

  it('should be able to validate an invalid genesis block', () => {
    blockchain.chain[0].data = 'Invalid data';

    expect(() => validate(blockchain.chain)).toThrowError(
      'The genesis block is invalid.',
    );
  });

  it('should be able to validate an invalid previous hash', () => {
    blockchain.addBlock('Block 1');
    blockchain.chain[1].previousHash = 'Invalid previous hash';

    expect(() => validate(blockchain.chain)).toThrowError(
      'The previous hash is invalid.',
    );
  });

  it('should be able to validate an invalid hash', () => {
    blockchain.addBlock('Block 1');
    blockchain.chain[1].hash = 'Invalid hash';

    expect(() => validate(blockchain.chain)).toThrowError(
      'The hash is invalid.',
    );
  });
});
