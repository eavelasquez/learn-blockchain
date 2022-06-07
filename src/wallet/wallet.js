import { elliptic, generateHash } from '../modules/index.js';
import Transaction from './transaction.js';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain) {
    this.balance = INITIAL_BALANCE;
    this.blockchain = blockchain;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    const hash = generateHash(data);
    return this.keyPair.sign(hash);
  }

  toString() {
    return `Wallet -
      balance:   ${this.balance}
      publicKey: ${this.publicKey}
    `;
  }

  createTransaction({ recipientAddress, amount }) {
    if (amount > this.balance) {
      throw new Error(`Amount: ${amount} exceeds balance: ${this.balance}`);
    }

    let txn = this.blockchain.memoryPool.findTransaction(this.publicKey);
    if (txn) {
      txn.update(this, recipientAddress, amount);
    } else {
      txn = Transaction.create(this, recipientAddress, amount);
      this.blockchain.memoryPool.addOrUpdateTransaction(txn);
    }

    return txn;
  }
}

export { INITIAL_BALANCE };
export default Wallet;
