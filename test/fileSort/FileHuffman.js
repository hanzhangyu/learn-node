const Huffman = require('./Huffman');

// const buildFilename = () =>
//   Math.random()
//     .toString(36)
//     .substring(6);
let i = 0;
const buildFilename = () => i++ + '';

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
    node.filename = buildFilename(); // fix name too long,
  }
}

module.exports = FileHuffman;
