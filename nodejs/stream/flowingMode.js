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
    console.log('readable.push return:', this.push(data));
  }
}

// 模拟资源池
const dataSource = {
  data: new Array(10).fill('-'),
  // 每次读取时 pop 一个数据
  makeData() {
    if (!dataSource.data.length) return null;
    return dataSource.data.pop();
  }
};

let i = 0;
const myReadable = new MyReadable(dataSource);
myReadable.setEncoding('utf8');
// 在 Stream 上绑定 ondata 方法就会自动触发这个模式 触发Flowing Mode
myReadable.on('data', chunk => {
  console.log(i++, chunk);
});
