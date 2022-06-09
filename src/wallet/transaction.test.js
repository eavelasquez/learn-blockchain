import { blockchainWallet } from './index.js';
import Transaction, { MINING_REWARD } from './transaction.js';
import Wallet from './wallet.js';

describe('Transaction class', () => {
  let amount;
  let recipientAddress;
  let transaction;
  let wallet;

  beforeEach(() => {
    amount = 5;
    wallet = new Wallet();
    recipientAddress = 'r4nd0m-4ddr3ss';
    transaction = Transaction.create(wallet, recipientAddress, amount);
  });

  it('should create an instance of Transaction', () => {
    expect(transaction instanceof Transaction).toBe(true);
  });

  it('should output the `amount` subtracted from the wallet balance', () => {
    const output = transaction.outputs.find(
      ({ address }) => address === wallet.publicKey,
    );

    expect(output.amount).toEqual(wallet.balance - amount);
  });

  it('should output the `amount` added to the recipient', () => {
    const output = transaction.outputs.find(
      ({ address }) => address === recipientAddress,
    );

    expect(output.amount).toEqual(amount);
  });

  describe('Transaction with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = wallet.balance + 1;
      transaction = undefined;
    });

    it('should throw an error when creating a transaction', () => {
      expect(() => {
        transaction = Transaction.create(wallet, recipientAddress, amount);
      }).toThrowError(`Amount: ${amount} exceeds balance: ${wallet.balance}`);
    });
  });

  it('should input the `balance` of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('should input the sender `address` of the wallet', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });

  it('should input has a signature', () => {
    expect(typeof transaction.input.signature).toEqual('object');
    expect(transaction.input.signature).toEqual(
      wallet.sign(transaction.outputs),
    );
  });

  it('should validate a valid transaction', () => {
    expect(Transaction.verify(transaction)).toBe(true);
  });

  it('should invalidate a corrupt transaction', () => {
    transaction.outputs[0].amount = amount + 1;

    expect(Transaction.verify(transaction)).toBe(false);
  });

  describe('and updating a transaction', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 10;
      nextRecipient = 'n3xt-4ddr3ss';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('should subtract the next amount from the sender output amount', () => {
      const output = transaction.outputs.find(
        ({ address }) => address === wallet.publicKey,
      );

      expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('should add the next amount to the recipient output amount', () => {
      const output = transaction.outputs.find(
        ({ address }) => address === nextRecipient,
      );

      expect(output.amount).toEqual(nextAmount);
    });
  });

  describe('and creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.reward(wallet, blockchainWallet);
    });

    it('should reward the miners wallet', () => {
      let output = transaction.outputs.find(
        ({ address }) => address === wallet.publicKey,
      );
      expect(output.amount).toEqual(MINING_REWARD);

      output = transaction.outputs.find(
        ({ address }) => address === blockchainWallet.publicKey,
      );
      expect(output.amount).toEqual(blockchainWallet.balance - MINING_REWARD);

      expect(transaction.outputs.length).toEqual(2);
    });
  });
});
