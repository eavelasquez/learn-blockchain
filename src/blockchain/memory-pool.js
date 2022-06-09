import { Transaction } from '../wallet/index.js';

class MemoryPool {
  constructor() {
    this.transactions = [];
  }

  addOrUpdateTransaction(transaction) {
    const { input, outputs = [] } = transaction;

    const outputTotal = outputs.reduce(
      (total, { amount }) => total + amount,
      0,
    );
    // TODO: pending test case
    if (outputTotal !== input.amount) {
      throw Error(`Invalid transaction from ${input.address}`);
    }
    // TODO: pending test case
    if (!Transaction.verify(transaction)) {
      throw Error(`Invalid signature from ${input.address}`);
    }

    const txnIndex = this.transactions.findIndex(
      (txn) => txn.id === transaction.id,
    );

    if (txnIndex >= 0) {
      this.transactions[txnIndex] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  findTransaction(address) {
    return this.transactions.find((txn) => txn.input.address === address);
  }

  wipeTransactions() {
    this.transactions = [];
  }
}

export default MemoryPool;
