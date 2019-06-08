const fs = require('fs');
const path = require('path');
const PromisifyRead = require('./PromisifyRead');
const TEST_FILE = path.resolve(__dirname, 'temp/promisifyRead');
const TEST_CACHE_SIZE = 6;
const TEST_STR = '0123456789';

describe('check props for PromisifyRead', () => {
  test('promisify method', () => {
    expect(PromisifyRead._open.toString()).toBeDefined();
    expect(PromisifyRead._read.toString()).toBeDefined();
    expect(PromisifyRead._close.toString()).toBeDefined();
  });

  test('initial props', () => {
    const promisifyRead = new PromisifyRead(TEST_FILE, TEST_CACHE_SIZE);
    expect(promisifyRead.buf.length).toBe(TEST_CACHE_SIZE);
    expect(promisifyRead.file).toBe(TEST_FILE);
    expect(promisifyRead.fd).toBe(null);
    expect(promisifyRead.position).toBe(0);
    expect(promisifyRead.isDestroyed).toBe(false);
    promisifyRead.destroy();
  });
});

describe('check read for PromisifyRead', () => {
  test('should read success', async () => {
    fs.writeFileSync(TEST_FILE, TEST_STR);
    const promisifyRead = new PromisifyRead(TEST_FILE);
    let data = await promisifyRead.read(TEST_CACHE_SIZE);
    expect(data).toBe(TEST_STR.slice(0, TEST_CACHE_SIZE));
    data = await promisifyRead.read(TEST_CACHE_SIZE);
    expect(data).toBe(TEST_STR.slice(TEST_CACHE_SIZE, TEST_STR.length));
    promisifyRead.destroy();
  });
});
