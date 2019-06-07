const fs = require('fs');
const util = require('util');

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

module.exports = PromisifyRead;
