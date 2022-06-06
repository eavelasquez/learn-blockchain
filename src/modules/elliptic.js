import Elliptic from 'elliptic';
import generateHash from '../modules/generate-hash.js';

const ec = new Elliptic.ec('secp256k1');

export default {
  createKeyPair: () => ec.genKeyPair(),
  verifySignature: (publicKey, signature, data) => {
    const key = ec.keyFromPublic(publicKey, 'hex');
    const hash = generateHash(data);

    return key.verify(hash, signature);
  }
}
