const LoserTree = require('./LoserTree');

test('should export an object', () => {
  const loserTree = new LoserTree([14, 38, 46, 39, 49, 51]);
  expect(loserTree.minimax).toBe(null);
});
