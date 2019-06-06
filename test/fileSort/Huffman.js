class Huffman {
  constructor(ary, k) {
    this.k = k;
    this.root = null;
    this.build(ary);
  }

  onNodeCreated(node, indexOfAry) {}

  static createNode(val) {
    return {
      isPlaceholder: val === null,
      val: Number(val),
      childs: null
    };
  }

  build(ary) {
    const forest = ary
      .map((val, index) => {
        const node = Huffman.createNode(val);
        this.onNodeCreated(node, index);
        return node;
      })
      .sort((a, b) => a.val - b.val);
    const overflow = ary.length % this.k;
    overflow !== 0 &&
      forest.unshift(
        ...new Array(this.k - overflow).fill(null).map(Huffman.createNode)
      );
    while (forest.length > 1) {
      const childs = forest.splice(0, this.k);
      const pnode = Huffman.createNode(
        childs.reduce((sum, child) => sum + child.val, 0)
      );
      pnode.childs = childs;
      this.onNodeCreated(pnode);
      // region keep sort
      const index = forest.findIndex(node => node.val > pnode.val);
      forest.splice(~index ? index : forest.length, 0, pnode);
      // endregion
    }
    this.root = forest[0];
  }
}

module.exports = Huffman;
