const FileHuffman = require('./FileHuffman');

test('should build the filename success', () => {
  const ary = [2, 3, 6, 9, 24, 12, 17, 18];
  const filename = [];
  const leafFilename = [];
  const huffman = new FileHuffman(ary, 3);
  (function traverseTree(root) {
    if (!root.childs) {
      const index = Number(root.filename.replace('.txt', '')); // restore the true widget from filename
      leafFilename[index] = root.val;
      return;
    }
    const index = Number(root.filename);
    expect(filename[index]).toEqual(undefined); // exist once
    filename[index] = null;
    root.childs
      .filter(child => !child.isPlaceholder)
      .forEach(child => traverseTree(child));
  })(huffman.root);
  expect(Number(huffman.root.filename)).toEqual(filename.length - 1); // 0 to n-1
  expect(ary).toEqual(leafFilename);
});
