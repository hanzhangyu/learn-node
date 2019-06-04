const LoserTree = require('./LoserTree');

describe('check props initial', () => {
  const ary = [14, 38, 46, 39, 49, 51];
  const loserTree = new LoserTree(ary);
  test('initial props', () => {
    expect(loserTree.minimax).toBe(null);
    expect(loserTree.minimaxPointer).toBe(null);
    expect(loserTree.k).toBe(ary.length);
  });
  test('the order of node', () => {
    expect(loserTree.nodes).toEqual([0, 3, 4, 1, 2, 5]);
    expect(loserTree.leaves).toEqual(
      ary.map(val => ({
        val,
        state: 1
      }))
    );
  });
});

describe('check for shift and push', () => {
  test('throw error when not have enough bucket', () => {
    const ary = [14, 38, 46, 39, 49, 51];
    const loserTree = new LoserTree(ary);
    expect(() => loserTree.push(2)).toThrowError('out of bucket');
  });
  test('shift the minimax', () => {
    const ary = [14, 38, 46, 39, 49, 51];
    const loserTree = new LoserTree(ary);
    expect(loserTree.shift()).toBe(14);
    expect(loserTree.minimax).toBe(14);
    expect(loserTree.minimaxPointer).toBe(0);
  });
  test('shift the all data', () => {
    const ary = [14, 38, 46, 39, 49, 51];
    const result = [];
    const loserTree = new LoserTree(ary);
    let minimax = loserTree.shift();
    while (minimax !== null) {
      result.push(minimax);
      loserTree.adjust(loserTree.minimaxPointer);
      minimax = loserTree.shift();
    }
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThan(result[i - 1]);
    }
    expect(loserTree.isEmpty()).toBe(true);
  });
  test('return is greater than minimax', () => {
    const ary = [14, 38, 46, 39, 49, 51];
    const loserTree = new LoserTree(ary);
    loserTree.shift();
    loserTree.push(100);
    expect(loserTree.shift()).toBe(38);
    expect(loserTree.minimax).toBe(38);
    loserTree.push(1);
    expect(loserTree.shift()).toBe(39);
    expect(loserTree.minimax).toBe(39);
    loserTree.push(40);
    expect(loserTree.shift()).toBe(40);
  });
  test('reset all status to get greater value', () => {
    const ary = [14, 38, 46, 39, 49, 51];
    const loserTree = new LoserTree(ary);
    const result = [];
    for (let i = 0; i < ary.length; i++) {
      loserTree.shift();
      loserTree.push(i);
    }
    loserTree.resetState();
    for (let i = 0; i < ary.length; i++) {
      result.push(loserTree.shift());
      loserTree.adjust(loserTree.minimaxPointer);
    }
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
