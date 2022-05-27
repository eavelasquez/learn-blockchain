class Block {
  constructor(data, hash, previousHash, timestamp) {
    this.data = data;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
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
