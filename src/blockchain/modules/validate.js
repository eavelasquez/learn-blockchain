import Block from '../block.js';

export default (blockchain) => {
  const [genesis, ...blocks] = blockchain;

  if (JSON.stringify(genesis) !== JSON.stringify(Block.genesis)) {
    throw Error('The genesis block is invalid.');
  }

  for (let i = 0; i < blocks.length; i += 1) {
    const {
      data, difficulty, hash, nonce, previousHash, timestamp,
    } = blocks[i];
    const previousBlock = blockchain[i];

    if (previousHash !== previousBlock.hash) {
      throw Error('The previous hash is invalid.');
    }

    const replicateHash = Block.hash({
      data,
      difficulty,
      nonce,
      previousHash,
      timestamp,
    });
    if (hash !== replicateHash) {
      throw Error('The hash is invalid.');
    }
  }

  return true;
};
