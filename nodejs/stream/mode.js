const Readable = require('stream').Readable;

/**
 * Flowing Mode
 */
// Stream 实现
class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }
  // 继承了 Readable 的类必须实现这个函数
  // 触发系统底层对流的读取
  _read() {
    const data = this.dataSource.makeData();
    const isNotBackPressure = this.push(data);
    console.log('readable.push return:', isNotBackPressure);
    // if (!isNotBackPressure) {
    //
    // }
  }
}

// 模拟资源池
const dataSource = {
  reset: () =>
    (dataSource.data = [
      '床',
      '前',
      '明',
      '月',
      '光',
      '，',
      '疑',
      '是',
      '地',
      '上',
      '霜',
      '。'
    ]),
  data: null,
  // 每次读取时 pop 一个数据
  makeData() {
    if (!dataSource.data.length) return null;
    return dataSource.data.shift();
  }
};

// region flowing
dataSource.reset();
let i = 0;
const myReadable = new MyReadable(dataSource);
myReadable.setEncoding('utf8'); // 让chunk不再是一个buffer对象，而是编码后的字符串
// 在 Stream 上绑定 ondata 方法就会自动触发这个模式 触发Flowing Mode
myReadable.on('data', chunk => {
  console.log(i++, chunk);
});
// endregion
myReadable.on('close', () => console.log(333));
// region pause
myReadable.on('end', () => {
  console.log('end');
  dataSource.reset();

  const rr = new MyReadable(dataSource);
  rr.on('readable', () => {
    let chunks = [];
    let chunk = null;
    let size = 0;
    while (null !== (chunk = rr.read())) {
      chunks.push(chunk);
      size += chunk.length;
    }
    chunks = Buffer.concat(chunks, size);
    console.log(chunks.toString('utf8'));
  });
});
// endregion
