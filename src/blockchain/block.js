import sha256 from 'crypto-js/sha256.js';
import adjustDifficulty from './modules/adjust-difficulty.js';

const DIFFICULTY = 3;

class Block {
  constructor({ data, difficulty, hash, nonce, previousHash, timestamp }) {
    this.data = data;
    this.difficulty = difficulty;
    this.hash = hash;
    this.nonce = nonce;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
  }

  static get genesis() {
    return new Block({
      data: 'Genesis Block',
      difficulty: DIFFICULTY,
      hash: '0',
      nonce: 0,
      previousHash: '0',
      timestamp: 1465154705,
    });
  }

  static hash({ data, difficulty, nonce, previousHash, timestamp }) {
    return sha256(
      `${data}${previousHash}${timestamp}${nonce}${difficulty}`
    ).toString();
  }

  static mine(previousBlock, data) {
    const { hash: previousHash } = previousBlock;
    let { difficulty } = previousBlock,
      hash = '',
      nonce = 0,
      timestamp = 0;

    do {
      timestamp = Date.now();
      nonce += 1;
      difficulty = adjustDifficulty(previousBlock, timestamp);
      hash = Block.hash({ data, difficulty, nonce, previousHash, timestamp });
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new Block({
      data,
      difficulty,
      hash,
      previousHash,
      timestamp,
      nonce,
    });
  }

  toString() {
    return `Block -
      data:         ${this.data}
      difficulty:   ${this.difficulty}
      hash:         ${this.hash}
      nonce:        ${this.nonce}
      previousHash: ${this.previousHash}
      timestamp:    ${this.timestamp}
    `;
  }
}

export { DIFFICULTY };
export default Block;
