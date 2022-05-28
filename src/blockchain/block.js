import sha256 from 'crypto-js/sha256.js';

class Block {
  constructor(data, hash, previousHash, timestamp) {
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
  }

  static get genesis() {
    return new Block('Genesis Block', '0', '', 1465154705);
  }

  static hash(data, previousHash, timestamp) {
    return sha256(`${data}${previousHash}${timestamp}`).toString();
  }

  static mine(previousBlock, data) {
    const timestamp = Date.now();
    const { hash: previousHash } = previousBlock;
    const hash = Block.hash(data, previousHash, timestamp);

    return new Block(data, hash, previousHash, timestamp);
  }

  toString() {
    return `Block -
      data: ${this.data}
      hash: ${this.hash}
      previousHash: ${this.previousHash}
      timestamp: ${this.timestamp}
    `;
  }
}

export default Block;
