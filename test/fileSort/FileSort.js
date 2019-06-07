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
      node.filename = `${indexOfAry}.txt`;
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

class PromisifyRead {
  constructor(file, cacheSize = 10) {
    this.buf = Buffer.alloc(cacheSize); // buffer
    this.fd = null; // file descriptor
    this.file = file; // file path
    this.position = 0; // file offset
  }

  // ignore the multibyte
  async read(length) {
    if (!this.fd) this.fd = await PromisifyRead._open(this.file, 'r');
    const { buffer, bytesRead } = await PromisifyRead._read(
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
    this.fd && (await PromisifyRead._close(this.fd));
    this.buf = null;
    this.fd = null;
    this.position = 0;
  }
}
PromisifyRead._open = util.promisify(fs.open);
PromisifyRead._read = util.promisify(fs.read);
PromisifyRead._close = util.promisify(fs.close);

/**
 * 1,1,11,1, => [1,1,11,1] and ''
 * 1,1,11,1 => [1,1,11] and '1'
 */
class Str2Ary {
  constructor() {
    this.restStr = ''; // string
    this.data = []; // string[]
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

  min() {
    return this.data[0];
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
    this.huffman = new FileHuffman(this.tempFilesSize, FileSort.K);
    this.cache.clear();
    this.huffman.root.filename = this.outFile;
    await this.merge();
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
    if (root.filename === '9.txt-5.txt-2.txt.txt') debugger;
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
FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA = 6; // 尽量控制在不超过6个，可能存在误差，一个数字最少占2个bytes（逗号）
FileSort.READ_STEP = FileSort.MAX_NUMBER_SIZE_IN_WOREK_AREA * 4; // 每次最多读取这么多字符串
FileSort.K = 3;

if (require.main === module) {
  const fileSort = new FileSort(
    path.resolve(__dirname, './test.txt'),
    path.resolve(__dirname, 'temp'),
    path.resolve(__dirname, 'temp/out.txt')
  );
  fileSort
    .clearTempDir()
    .then(() => fileSort.run())
    .catch(err => console.error(err));
  console.log('\x1b[36msort success in %s\x1b[0m', fileSort.outFile);
}

module.exports = FileSort;
