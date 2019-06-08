const fs = require('fs');
const path = require('path');
const MemoryCache = require('./MemoryCache');
const TEST_SIZE = 5;
const TEST_FILE = path.resolve(__dirname, 'temp/memoryCacheTest');

describe('check props for cache', () => {
  const mCache = new MemoryCache(TEST_SIZE);
  test('initial props', () => {
    expect(mCache.maxsize).toBe(TEST_SIZE);
    expect(mCache.cache).toEqual([]);
    expect(mCache.outFile).toBe(null);
    expect(mCache.outSize).toBe(0);
    expect(mCache.length).toBe(0);
  });
});

describe('check push for cache', () => {
  test('should push success', async () => {
    const mCache = new MemoryCache(TEST_SIZE);
    await mCache.push(1);
    await mCache.push(2);
    expect(mCache.length).toBe(2);
    expect(mCache.cache).toEqual([1, 2]);
  });

  test('should throw out of memory when space is not enough', async () => {
    const mCache = new MemoryCache(TEST_SIZE);
    for (let i = 0; i < TEST_SIZE - 1; i++) {
      await mCache.push('');
    }
    expect(mCache.outFile).toBe(null);
    expect(mCache.push('')).rejects.toThrowError('out of memory');
  });
});

describe('check write for cache', () => {
  test('should write success when space is not enough', async () => {
    const mCache = new MemoryCache(TEST_SIZE);
    mCache.outFile = TEST_FILE;
    try {
      fs.unlinkSync(mCache.outFile);
    } catch (err) {}
    for (let i = 0; i <= TEST_SIZE; i++) {
      await mCache.push(i);
    }
    expect(mCache.cache).toEqual([TEST_SIZE]);
    const data = fs.readFileSync(mCache.outFile, 'utf8');
    expect(data).toBe(Array.from(Array(TEST_SIZE).keys()).join(',') + ',');
  });

  test('should write success', async () => {
    const mCache = new MemoryCache(5);
    mCache.outFile = TEST_FILE;
    try {
      fs.unlinkSync(mCache.outFile);
    } catch (err) {}
    await mCache.push(1);
    mCache.write();
    await mCache.push(2);
    mCache.write();
    const data = fs.readFileSync(mCache.outFile, 'utf8');
    expect(data).toEqual('12');
  });
});
