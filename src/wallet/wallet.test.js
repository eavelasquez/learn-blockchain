import Wallet, { INITIAL_BALANCE } from './wallet';

describe('Wallet class', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
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
});
