const fs = require('fs');
const path = require('path');
const util = require('util');
const LoserTree = require('./LoserTree');
const Huffman = require('./Huffman');

class FileHuffman extends Huffman {
  constructor(ary, k) {
    super(ary, k);
    this.isMerged = false;
  }
  onNodeCreated(node, indexOfAry) {
    if (indexOfAry !== undefined) {
      node.filename = `${node.val}.txt`;
      return;
    }
    node.filename = `${node.childs
      .filter(child => !child.isPlaceholder)
      .map(child => child.filename)
      .join('-')}.txt`;
  }
}

class MemoryCache {
  constructor(maxsize) {
    this.maxsize = maxsize;
    this.cache = [];
    this.outFile = null;
    this.outSize = 0;
  }
  get length() {
    return this.cache.length;
  }
  clear() {
    this.outSize = 0;
    this.cache = [];
  }
  async push(val) {
    this.cache.push(val);
    if (this.cache.length >= this.maxsize) {
      if (this.outFile) {
        fs.writeFileSync(this.outFile, this.cache.join(',') + ',', {
          flag: 'a'
        });
        this.outSize += this.cache.length;
        this.cache = [];
      } else {
        throw new Error('out of memory');
      }
    }
  }
  write() {
    fs.writeFileSync(this.outFile, this.cache.join(','), { flag: 'a' });
    const outSize = this.outSize + this.cache.length;
    this.clear();
    return outSize;
  }
}

class PromisifyReadStream {
  constructor(file, cacheSize = 10) {
    this.buf = Buffer.alloc(cacheSize);
    this.fd = null;
    this.file = file;
    this.position = 0;
  }

  // ignore the multibyte
  async read(length) {
    if (!this.fd) this.fd = await PromisifyReadStream._open(this.file, 'r');
    const { buffer, bytesRead } = await PromisifyReadStream._read(
      this.fd,
      this.buf,
      0,
      length,
      this.position
    );
    this.position += bytesRead;
    return buffer.toString().slice(0, bytesRead);
  }

  async destroy() {
    this.fd && (await PromisifyReadStream._close(this.fd));
    this.buf = null;
    this.fd = null;
    this.position = 0;
  }
}
PromisifyReadStream._open = util.promisify(fs.open);
PromisifyReadStream._read = util.promisify(fs.read);
PromisifyReadStream._close = util.promisify(fs.close);

class Str2Ary {
  constructor() {
    this.restStr = '';
    this.data = [];
  }

  get length() {
    return this.data.length;
  }

  shift() {
    return this.data.shift();
  }

  splice(...restProps) {
    return this.data.splice(...restProps);
  }

  add(str) {
    str = this.restStr + str;
    this.data.push(...str.split(','));
    this.restStr = this.data.splice(this.data.length - 1, 1).toString();
  }

  getEnd() {
    if (this.data.length) throw new Error('array data exist');
    const temp = this.restStr;
    this.restStr = '';
    return temp;
  }
}

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
    await this.createInitialChunk();
    console.log(this.tempFilesSize);
    this.huffman = new FileHuffman(this.tempFilesSize, FileSort.K);
    this.cache.clear();
  }

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

  async test() {
    // const data = await Promise.all([]);
    // const promisifyReadStream = new PromisifyReadStream(
    //   path.resolve(__dirname, './ddd.txt'),
    //   20
    // );
    // const data = await promisifyReadStream.read(10);
    // console.log(data);
  }

  async merge(root = this.huffman.root) {
    root.childs.forEach(child => child.childs && this.merge(child)); // DFS
    const nodes = root.childs.filter(child => !child.isPlaceholder);
    if (nodes.length === 1) return; // keep file
    // TODO merge left, mark file as isMerged
    this.cache.clear();
    const frs = nodes.map(node => new PromisifyReadStream(node.filename, 20));
    const datas = nodes.map(() => []);
    const dataStr = await frs[0].read(FileSort.READ_STEP);
    const data = dataStr.split(',');
    let restStr = data.splice(data.length - 1, 1).toString();
    this.cache.push();
  }
}
FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA = 6; // 尽量控制在不超过6个，可能存在误差，一个数字最少占2个bytes（逗号）
FileSort.READ_STEP = FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA * 4; // 每次最多读取这么多字符串
FileSort.K = 3;

const fileSort = new FileSort(
  path.resolve(__dirname, './test.txt'),
  path.resolve(__dirname, 'temp')
);
// fileSort.run().catch(err => console.error(err));
fileSort.run();
// region create initial merge chunk

// endregion

module.exports = FileSort;
