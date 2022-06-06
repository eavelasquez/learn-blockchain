import Elliptic from 'elliptic';
import generateHash from '../modules/generate-hash.js';

const ec = new Elliptic.ec('secp256k1');
const INITIAL_BALANCE = 100;

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ec.genKeyPair();
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
