import Blockchain from '../blockchain/index.js';
import Wallet, { INITIAL_BALANCE } from './wallet.js';

describe('Wallet class', () => {
  let wallet;
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
    wallet = new Wallet(blockchain);
  });

  it('should create a healthy wallet', () => {
    expect(wallet.balance).toEqual(INITIAL_BALANCE);
    expect(typeof wallet.keyPair).toEqual('object');
    expect(typeof wallet.publicKey).toEqual('string');
    expect(wallet.publicKey.length).toEqual(130);
  });

  it('should return a string representation of the wallet', () => {
    const result = wallet.toString();

    expect(result).toMatch(/Wallet -/);
    expect(typeof result).toEqual('string');
  });

  it('should sign a transaction', () => {
    const signature = wallet.sign('foo');

    expect(typeof signature).toEqual('object');
    expect(signature).toEqual(wallet.sign('foo'));
  });

  describe('creating a transaction', () => {
    let transaction;
    let recipientAddress;
    let amount;

    beforeEach(() => {
      amount = 5;
      recipientAddress = 'random-address';
      transaction = wallet.createTransaction({ recipientAddress, amount });
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        transaction = wallet.createTransaction({ recipientAddress, amount });
      });

      it('should double the amount subtracted from the wallet account', () => {
        const output = transaction.outputs.find(
          ({ address }) => address === wallet.publicKey,
        );

        expect(output.amount).toEqual(wallet.balance - amount * 2);
      });

      it('should clone the `amount` output for the transaction', () => {
        const amounts = transaction.outputs
          .filter((output) => output.address === recipientAddress)
          .map((output) => output.amount);

        expect(amounts).toEqual([amount, amount]);
      });
    });
  });

  describe('calculating balance', () => {
    let addBalance;
    let times;
    let senderWallet;

    beforeEach(() => {
      addBalance = 16;
      times = 3;
      senderWallet = new Wallet(blockchain);

      for (let i = 0; i < times; i += 1) {
        senderWallet.createTransaction({
          recipientAddress: wallet.publicKey,
          amount: addBalance,
        });
      }

      blockchain.addBlock(blockchain.memoryPool.transactions);
    });

    it('should calculate the balance for blockchain txs matching the recipient', () => {
      const balance = wallet.calculateBalance();
      const expectedBalance = INITIAL_BALANCE + (addBalance * times);

      expect(balance).toEqual(expectedBalance);
    });

    it('should calculate the balance for blockchain txs matching the sender', () => {
      const balance = senderWallet.calculateBalance();
      const expectedBalance = INITIAL_BALANCE - (addBalance * times);

      expect(balance).toEqual(expectedBalance);
    });

    describe('and the recipient conducts a transaction', () => {
      let subtractBalance;
      let recipientBalance;

      beforeEach(() => {
        subtractBalance = 64;
        recipientBalance = wallet.calculateBalance();

        blockchain.memoryPool.wipeTransactions();

        wallet.createTransaction({
          recipientAddress: senderWallet.publicKey,
          amount: addBalance,
        });

        blockchain.addBlock(blockchain.memoryPool.transactions);
      });

      describe('and the sender sends another transaction to recipient', () => {
        beforeEach(() => {
          blockchain.memoryPool.wipeTransactions();

          senderWallet.createTransaction({
            recipientAddress: wallet.publicKey,
            amount: addBalance,
          });

          blockchain.addBlock(blockchain.memoryPool.transactions);
        });

        it('should calculate the recipient balance only using txs since its mos recent one', () => {
          const balance = wallet.calculateBalance();
          const expectedBalance = recipientBalance - subtractBalance + addBalance;

          expect(balance).toEqual(expectedBalance);
        });
      });
    });
  });
});
