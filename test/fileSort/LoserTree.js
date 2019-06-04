class LoserTree {
  constructor(ary) {
    this.minimax = null; // 最大胜者的值
    this.minimaxPointer = null; // 最大胜者的位置
    this.k = ary.length;
    this.nodes = Array(this.k).fill(0); // 顺序储存树结构，记录位置
    this.leaves = ary.map(val => ({
      val: Number(val),
      state: LoserTree.NODE_STATE.init
    })); // 每一个节点
    this.adjustAll();
  }

  adjustAll() {
    for (let i = this.k - 1; i >= 0; i--) this.adjust(i);
  }

  /**
   * 将有序的败者树的状态进行重置，在释放上一个归并段后触发
   */
  resetState() {
    this.leaves.forEach(node => (node.state = LoserTree.NODE_STATE.init));
    for (let i = this.k - 1; i >= 0; i--) this.nodes[i] = 0;
    this.adjustAll();
  }

  /**
   *
   */
  isEmpty() {
    return this.leaves.every(item => item.state === LoserTree.NODE_STATE.less);
  }

  /**
   * 返回败者树的胜者，并标记该位置
   * @returns {null|number} 默认返回当前胜者的位置，如果所有节点均小于minimax，则返回null
   */
  shift() {
    this.minimaxPointer = this.nodes[0];
    const curMiniMaxNode = this.leaves[this.minimaxPointer];
    if (curMiniMaxNode.state === LoserTree.NODE_STATE.less) return null; // 所有的节点状态都为小于minimax
    this.minimax = curMiniMaxNode.val;
    curMiniMaxNode.state = LoserTree.NODE_STATE.less;
    return this.minimax;
  }

  /**
   * 推入新的节点至原胜者的位置，并对该位置进行调整
   * @param val 新值
   */
  push(val) {
    val = Number(val);
    const curMiniMaxNode = this.leaves[this.minimaxPointer];
    if (!(curMiniMaxNode && curMiniMaxNode.state === LoserTree.NODE_STATE.less))
      throw new Error('out of bucket');
    curMiniMaxNode.val = val;
    if (this.minimax <= val) curMiniMaxNode.state = LoserTree.NODE_STATE.normal;
    this.adjust(this.minimaxPointer);
  }

  /**
   * 向上调整败者树
   * @param index 需要调整的节点在leaves中的位置
   */
  adjust(index) {
    if (this.leaves[index].state === LoserTree.NODE_STATE.init)
      this.leaves[index].state = LoserTree.NODE_STATE.normal;
    let parent = (index + this.k) >> 1;
    while (parent > 0) {
      const parentPointer = this.nodes[parent];
      const parentNode = this.leaves[parentPointer];
      const curNode = this.leaves[index];
      if (
        parentNode.state < curNode.state || // 先比较state
        (parentNode.state === curNode.state && parentNode.val < curNode.val) // state一致value决胜负
      ) {
        this.nodes[parent] = index; // loser
        index = parentPointer; // winner
      }
      parent = parent >> 1;
    }
    this.nodes[0] = index;
  }

  /**
   * 序列化
   * @returns {string}
   */
  /* istanbul ignore next */
  toString() {
    const nodes = this.nodes
      .map(index => {
        const { val, state } = this.leaves[index];
        return `val: ${val}, state: ${state}`;
      })
      .join(' | ');
    const leaves = this.leaves.map(({ val }) => val).join(' | ');
    return `nodes: ${nodes} ***** leaves: ${leaves}`;
  }
}
LoserTree.NODE_STATE = {
  // 对比胜负时，大者负
  init: 0, // 尚未初始化的节点
  normal: 1, // 已有值的节点
  less: 2 // 节点值小于minimax
};

module.exports = LoserTree;
