import Block from './block';

class MemoryPool {
  constructor() {
    this.transactions = [];
  }

  addOrUpdateTransaction(transaction) {
    const txnIndex = this.transactions.findIndex(
      (txn) => txn.id === transaction.id
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
}

export default MemoryPool;
