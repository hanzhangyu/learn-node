const fs = require('fs');
const path = require('path');
const LoserTree = require('./LoserTree');
const inputFilePath = path.resolve(__dirname, './test.txt');

const MAX_NUMBER_SIZE_IN_WOEK_AREA = 6;
const READ_STEP = 24;
const K = 3;
// region create initial merge chunk
const fr = fs.createReadStream(inputFilePath, {
  encoding: 'utf8'
});
const fw = (reset = true) => {
  console.log(cache);
  console.log(cache.length);
  cache = [];
  reset && loserTree.resetState();
};
const ary = [];
let loserTree = null;
let minimax = -Infinity;
let restStr = '';
let cache = [];
fr.on('readable', async () => {
  let data;
  while ((data = fr.read(READ_STEP))) {
    let curData = restStr + data;
    ary.push(...curData.split(','));
    restStr = ary.splice(ary.length - 1, 1).toString();
    // 取出K个元素，构成loserTree
    if (!loserTree) {
      loserTree = new LoserTree(ary.splice(0, MAX_NUMBER_SIZE_IN_WOEK_AREA));
    }
    // 数组还有元素时
    while (ary.length) {
      minimax = loserTree.shift();
      if (minimax !== null) {
        cache.push(minimax);
        loserTree.push(ary.shift());
      } else {
        fw();
      }
    }
    // loserTree没有可用元素时，重置状态
    if (loserTree.isEmpty()) fw();
  }
}).on('close', () => {
  while ((minimax = loserTree.shift())) {
    // check the left value in tree
    if (restStr) {
      loserTree.push(restStr); // push the last one
      restStr = '';
    } else loserTree.adjust(loserTree.minimaxPointer);
    cache.push(minimax);
  }
  fw(false);
  console.log('close');
});
// endregion
