import { v1 as uuidv1 } from 'uuid';

class Transaction {
  constructor() {
    this.id = uuidv1();
    this.input = null;
    this.outputs = [];
  }

  static create(senderWallet, recipientAddress, amount) {
    const { balance, publicKey } = senderWallet;

    if (amount > balance) {
      throw new Error(`Amount: ${amount} exceeds balance: ${balance}`);
    }

    const transaction = new Transaction();
    transaction.outputs.push(
      ...[
        { amount: balance - amount, address: publicKey },
        { amount, address: recipientAddress },
      ]
    );
    transaction.input = {
      address: senderWallet.publicKey,
      amount: balance,
      signature: senderWallet.sign(transaction.outputs),
      timestamp: Date.now(),
    };

    return transaction;
  }
}

export default Transaction;
