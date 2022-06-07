import MemoryPool from './memory-pool';
import Wallet, { Transaction } from '../wallet/index.js';

describe('MemoryPool class', () => {
  let memoryPool, transaction, wallet;

  beforeEach(() => {
    memoryPool = new MemoryPool();
    wallet = new Wallet();
    transaction = Transaction.create(wallet, 'recipient-address', 5);
    memoryPool.addOrUpdateTransaction(transaction);
  });

  it('should add a transaction to the memory pool', () => {
    expect(memoryPool.transactions).toEqual([transaction]);
    expect(memoryPool.transactions.length).toBe(1);
  });

  it('should add a transaction in the memory pool', () => {
    const found = memoryPool.transactions.find((txn) => txn.id === transaction.id);

    expect(found).toEqual(transaction);
  });

  it('should update a transaction in the memory pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'new-recipient-address', 10);
    memoryPool.addOrUpdateTransaction(newTransaction);

    const found = memoryPool.transactions.find((txn) => txn.id === transaction.id);

    expect(JSON.stringify(found)).not.toEqual(oldTransaction);
    expect(newTransaction).toEqual(found);
    expect(memoryPool.transactions.length).toBe(1);
  });
});
