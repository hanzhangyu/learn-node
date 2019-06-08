const fs = require('fs');
const path = require('path');
const util = require('util');
const LoserTree = require('./LoserTree');
const Str2Ary = require('./Str2Ary');
const FileHuffman = require('./FileHuffman');
const MemoryCache = require('./MemoryCache');
const PromisifyRead = require('./PromisifyRead');

class FileSort {
  constructor(file, tempDir, outFile) {
    this.huffman = null;
    this.file = file;
    this.tempDir = tempDir;
    this.tempFilesSize = [];
    this.outFile = outFile;
    this.cache = new MemoryCache(FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA);
  }

  async run() {
    console.time('build initial chunk');
    await this.createInitialChunk();
    console.timeEnd('build initial chunk');
    this.huffman = new FileHuffman(this.tempFilesSize, FileSort.K);
    this.cache.clear();
    this.huffman.root.filename = this.outFile;
    console.time('merge');
    await this.merge();
    console.timeEnd('merge');
  }

  // TODO refactor by PromisifyRead, stream is not suitable for this case
  createInitialChunk() {
    const str2Ary = new Str2Ary();
    let loserTree = null;
    let minimax = -Infinity;
    let chunkIndex = '0.txt';
    const writeLeftToFileAndUseNewFile = () => {
      const outSize = this.cache.write();
      const chunkIndexInt = parseInt(chunkIndex);
      this.tempFilesSize[chunkIndexInt] = outSize;
      chunkIndex = chunkIndexInt + 1 + '.txt';
      this.cache.outFile = path.resolve(this.tempDir, chunkIndex);
    };
    this.cache.outFile = path.resolve(this.tempDir, chunkIndex);
    return new Promise((resolve, reject) => {
      const fr = fs.createReadStream(this.file, { encoding: 'utf8' });
      fr.on('readable', async () => {
        try {
          let data;
          while ((data = fr.read(FileSort.READ_STEP))) {
            str2Ary.add(data);
            // 取出K个元素，构成loserTree
            if (!loserTree) {
              loserTree = new LoserTree(
                str2Ary.splice(0, FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA)
              );
            }
            // 数组还有元素时
            while (str2Ary.length) {
              minimax = loserTree.shift();
              if (minimax !== null) {
                await this.cache.push(minimax);
                loserTree.push(str2Ary.shift());
              } else {
                writeLeftToFileAndUseNewFile();
                loserTree.resetState();
              }
            }
            // loserTree没有可用元素时，重置状态
            if (loserTree.isEmpty()) {
              writeLeftToFileAndUseNewFile();
              loserTree.resetState();
            }
          }
        } catch (err) {
          fr.destroy(err);
        }
      })
        .on('close', async () => {
          try {
            while ((minimax = loserTree.shift())) {
              // check the left value in tree
              const restStr = str2Ary.getEnd();
              if (restStr) {
                loserTree.push(restStr); // push the last one
              } else loserTree.adjust(loserTree.minimaxPointer);
              await this.cache.push(minimax);
            }
            writeLeftToFileAndUseNewFile();
            resolve();
          } catch (err) {
            fr.destroy(err);
          }
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  async merge(root = this.huffman.root) {
    for (let i = root.childs.length - 1; i >= 0; i--) {
      // DFS
      const child = root.childs[i];
      if (child.childs) {
        await this.merge(child);
      }
    }
    const childs = root.childs.filter(child => !child.isPlaceholder);
    if (childs.length === 1) {
      root.filename = childs[0].filename; // keep file and set as parent
      return;
    }
    this.cache.clear();
    this.cache.outFile = path.resolve(this.tempDir, root.filename);
    let nodes = childs.map(node => ({
      fr: new PromisifyRead(
        path.resolve(this.tempDir, node.filename),
        FileSort.READ_STEP
      ),
      str2Ary: new Str2Ary()
    }));
    while (true) {
      // region read for empty node
      const readQueue = nodes.filter(node => !node.str2Ary.length);
      if (readQueue.length) {
        const datas = await Promise.all(
          readQueue.map(node => node.fr.read(FileSort.READ_STEP))
        );
        // region set data to node and remove the empty child
        const destroyQueue = [];
        readQueue.forEach((node, index) => {
          if (datas[index]) node.str2Ary.add(datas[index]);
          else destroyQueue.push(node.fr.destroy());
        });
        if (destroyQueue.length) {
          await Promise.all(destroyQueue);
          nodes = nodes.filter(node => node.str2Ary.length);
        }
        if (!nodes.length) break;
        // endregion
      }
      // endregion

      // region shift the minimum and push to cache
      let min = Infinity;
      let minIndex = null;
      nodes.forEach((node, index) => {
        let val = Number(node.str2Ary.min());
        if (val < min) {
          min = val;
          minIndex = index;
        }
      });
      nodes[minIndex].str2Ary.shift();
      await this.cache.push(min);
      // endregion
    }
    this.cache.write(); // write left data to out file
  }

  async clearTempDir() {
    const files = await util.promisify(fs.readdir)(this.tempDir);
    const _unlink = util.promisify(fs.unlink);
    await Promise.all(
      files
        .filter(filename => filename !== '.gitignore')
        .map(file => _unlink(path.resolve(this.tempDir, file)))
    );
  }
}
FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA = 100000; // 尽量控制在不超过6个，可能存在误差，一个数字最少占2个bytes（逗号）
FileSort.READ_STEP = FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA * 4; // 每次最多读取这么多字符串
FileSort.K = 6;

if (require.main === module) {
  const fileSort = new FileSort(
    path.resolve(__dirname, '../../files/big-sort-file.txt'),
    path.resolve(__dirname, 'temp'),
    path.resolve(__dirname, 'temp/out.txt')
  );
  fileSort
    .clearTempDir()
    .then(() => fileSort.run())
    .then(() =>
      console.log('\x1b[36msort success in %s\x1b[0m', fileSort.outFile)
    )
    .catch(err => console.error(err));
}

module.exports = FileSort;
