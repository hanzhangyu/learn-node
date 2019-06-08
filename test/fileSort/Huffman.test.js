const Huffman = require('./Huffman');

test('should create node success', () => {
  let node = Huffman.createNode('1');
  expect(node.val).toBe(1);
  node = Huffman.createNode('1xcxcc');
  expect(node.val).toBe(NaN);
  node = Huffman.createNode(null);
  expect(node.isPlaceholder).toBe(true);
});
test('should the sum of weight is minimum', () => {
  const ary = [2, 3, 6, 9, 24, 12, 17, 18];
  const huffman = new Huffman(ary, 3);
  expect(huffman.root.val).toEqual(91);
});
