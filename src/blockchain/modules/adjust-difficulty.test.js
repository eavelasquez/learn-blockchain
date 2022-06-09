import adjustDifficulty from './adjust-difficulty.js';

describe('adjust difficulty module', () => {
  let block;

  beforeEach(() => {
    block = { difficulty: 3, timestamp: Date.now() };
  });

  it('should return a reduced difficulty if block.timestamp is more greater than 3 seconds', () => {
    const timestamp = block.timestamp + 3000;
    const expectedDifficulty = block.difficulty - 1;

    expect(adjustDifficulty(block, timestamp)).toEqual(expectedDifficulty);
  });

  it('should return an increased difficulty if block.timestamp is less than 3 seconds', () => {
    const timestamp = block.timestamp + 1000;
    const expectedDifficulty = block.difficulty + 1;

    expect(adjustDifficulty(block, timestamp)).toEqual(expectedDifficulty);
  });
});
