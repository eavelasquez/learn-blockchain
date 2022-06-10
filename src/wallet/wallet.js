import { elliptic, generateHash } from '../modules/index.js';
import Transaction from './transaction.js';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain, initialBalance = INITIAL_BALANCE) {
    this.balance = initialBalance;
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
      publicKey: ${this.publicKey.toString()}
    `;
  }

  createTransaction({ recipientAddress, amount }) {
    if (amount > this.balance) {
      throw Error(`Amount: ${amount} exceeds balance: ${this.balance}`);
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

  calculateBalance() {
    const {
      blockchain: { chain = [] },
      publicKey,
    } = this;
    let { balance = 0 } = this;
    const transactions = [];

    chain.forEach(({ data = [] }) => {
      if (Array.isArray(data)) {
        data.forEach((txn) => transactions.push(txn));
      }
    });

    const walletInputTxs = transactions.filter(
      (txn) => txn.input.address === publicKey,
    );
    let timestamp = 0;

    if (walletInputTxs.length > 0) {
      const recentInputTx = walletInputTxs
        .sort((a, b) => a.input.timestamp - b.input.timestamp)
        .pop(); // get the most recent input transaction

      timestamp = recentInputTx.input.timestamp;
      balance = recentInputTx.outputs.find(
        ({ address }) => address === publicKey,
      ).amount;
    }

    transactions
      .filter(({ input }) => input.timestamp > timestamp)
      .forEach(({ outputs }) => {
        outputs.find(({ address, amount }) => {
          if (address === publicKey) {
            balance += amount;
          }
          return false;
        });
      });

    return balance;
  }
}

export { INITIAL_BALANCE };
export default Wallet;
