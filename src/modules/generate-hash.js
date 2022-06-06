import sha256 from 'crypto-js/sha256.js';

export default (data) => sha256(JSON.stringify(data)).toString();
