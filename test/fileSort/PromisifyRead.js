const fs = require('fs');
const util = require('util');

class PromisifyRead {
  constructor(file, cacheSize = 10) {
    this.buf = Buffer.alloc(cacheSize); // buffer
    this.fd = null; // file descriptor
    this.file = file; // file path
    this.position = 0; // file offset
  }

  get isDestroyed() {
    return this.buf === null;
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

// const promisifyRead = new PromisifyRead(require('path').resolve(__dirname, 'test.txt'));
// promisifyRead.read(5).then(console.log);

// async function test() {
//   const promisifyRead = new PromisifyRead(require('path').resolve(__dirname, 'test.txt'));
//   console.log(await promisifyRead.read(5));
// }
// test();

module.exports = PromisifyRead;
