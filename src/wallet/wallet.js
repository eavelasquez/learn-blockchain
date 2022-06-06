import { elliptic, generateHash } from '../modules/index.js';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
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
      publicKey: ${this.publicKey}
    `;
  }
}

export { INITIAL_BALANCE };
export default Wallet;
