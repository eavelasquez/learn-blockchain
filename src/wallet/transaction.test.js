import Transaction from './transaction';
import Wallet from './wallet';

describe('Transaction class', () => {
  let amount, transaction, wallet, recipientAddress;

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
      ({ address }) => address === wallet.publicKey
    );

    expect(output.amount).toEqual(wallet.balance - amount);
  });

  it('should output the `amount` added to the recipient', () => {
    const output = transaction.outputs.find(
      ({ address }) => address === recipientAddress
    );

    expect(output.amount).toEqual(amount);
  });

  describe('Transaction with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = wallet.balance + 1;
      transaction = undefined;
    });

    it('should throw an error', () => {
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
    expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
  });
});
