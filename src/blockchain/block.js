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
