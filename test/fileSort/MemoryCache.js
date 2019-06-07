const fs = require('fs');

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

module.exports = MemoryCache;
