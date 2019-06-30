const fs = require('fs');
const path = require('path');

// 此时无法阻止退出事件循环，在调用 'exit' 事件监听器之后，Node.js 进程将立即退出事件循环
process.on('exit', exitCode => {
  process.stdout.write(exitCode + '\n');
  process.nextTick(() => {
    process.stdout.write('nextTick\n'); // TODO nextTick 退出，这很不科学？lib/internal/process/task_queues.js里的逻辑也不是这样的呀，这应该是nodejs的一个BUG
  });
  Promise.resolve().then(() => {
    process.stdout.write('promise resolve\n'); // microTask 不会退出
  });
  setImmediate(() => {
    process.stdout.write('此处不会运行');
  });
});

// region 显式调用虽然也可以触发exit（在调用所有的 'exit' 事件监听器之前，Node.js 不会终止），但是microTask 都会退出
// process.exit(0); // 0
// throw new Error('err'); // 1
// endregion

// region 错误处理，遇到错误正确的处理方式时，捕获并清理任务，设置exitCode，自然退出
try {
  throw new Error('catched error');
} catch (e) {
  // process.stdout 的写入有时是异步的（比如任务繁忙时，这里使用写文件来模拟）， 这时候就不应该使用process.exit 打断事件循环
  fs.writeFile(path.resolve(__dirname, './.temp/temp.txt'), e + '', () => {});
  // close other task...
  // process.exit(1); // 在 Worker 线程中，此函数将停止当前线程而不是当前进程。
  process.exitCode = 1; // 尽量不要调用process.exit，而选择使用设置exitCode代替，然后让其自然终止
}

/// endregion
