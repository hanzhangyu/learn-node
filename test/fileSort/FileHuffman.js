const Huffman = require('./Huffman');

class FileHuffman extends Huffman {
  constructor(ary, k) {
    super(ary, k);
    this.isMerged = false;
  }
  onNodeCreated(node, indexOfAry) {
    if (indexOfAry !== undefined) {
      node.filename = `${indexOfAry}.txt`;
      return;
    }
    node.filename = `${node.childs
      .filter(child => !child.isPlaceholder)
      .map(child => child.filename)
      .join('-')}.txt`;
  }
}

module.exports = FileHuffman;
