import sha256 from 'crypto-js/sha256.js';

const DIFFICULTY = 3;

class Block {
  constructor(data, hash, previousHash, timestamp, nonce) {
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
  }

  static get genesis() {
    return new Block('Genesis Block', '0', '', 1465154705, 0);
  }

  static hash(data, previousHash, timestamp, nonce) {
    return sha256(`${data}${previousHash}${timestamp}${nonce}`).toString();
  }

  static mine(previousBlock, data) {
    const { hash: previousHash } = previousBlock;
    let hash = '', nonce = 0, timestamp = 0;

    do {
      nonce += 1;
      timestamp = Date.now();
      hash = Block.hash(data, previousHash, timestamp, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return new Block(data, hash, previousHash, timestamp, nonce);
  }

  toString() {
    return `Block -
      data: ${this.data}
      hash: ${this.hash}
      nonce: ${this.nonce}
      previousHash: ${this.previousHash}
      timestamp: ${this.timestamp}
    `;
  }
}

export { DIFFICULTY };
export default Block;
