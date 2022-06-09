import { MESSAGE_TYPES } from '../service/p2p.js';
import { Transaction, blockchainWallet } from '../wallet/index.js';

class Miner {
  constructor({ blockchain, p2pService, wallet }) {
    this.blockchain = blockchain;
    this.p2pService = p2pService;
    this.wallet = wallet;
  }

  mine() {
    if (this.blockchain.memoryPool.length === 0) {
      throw new Error('There are no unconfirmed transactions.');
    }

    // 1. Include reward to miner in transaction
    const rewardTransaction = Transaction.reward(
      this.wallet,
      blockchainWallet,
    );
    this.blockchain.memoryPool.transactions.push(rewardTransaction);

    // 2. Create a block consisting on valid transactions
    const block = this.blockchain.addBlock(this.blockchain.memoryPool.transactions);

    // 3. Sync the block to other nodes
    this.p2pService.sync();

    // 4. Wipe transaction from memory pool
    this.blockchain.memoryPool.wipeTransactions();

    // 5. Broadcast wipe message to every node
    this.p2pService.broadcast(MESSAGE_TYPES);

    return block;
  }
}

export default Miner;
