import Blockchain from '../blockchain';
import Wallet, { INITIAL_BALANCE } from './wallet';

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
          (output) => output.address === wallet.publicKey
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
});
