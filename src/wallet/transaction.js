import { v1 as uuidv1 } from 'uuid';
import { elliptic } from '../modules/index.js';

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
    transaction.input = Transaction.sign(transaction, senderWallet);

    return transaction;
  }

  static verify(transaction) {
    const {
      input: { address, signature },
      outputs,
    } = transaction;

    return elliptic.verifySignature(address, signature, outputs);
  }

  static sign(transaction, senderWallet) {
    return {
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(transaction.outputs),
      timestamp: Date.now(),
    };
  }
}

export default Transaction;
