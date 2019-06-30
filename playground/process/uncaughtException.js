const fs = require('fs');

// 当未捕获的 JavaScript 异常一直冒泡回到事件循环时，会触发 'uncaughtException' 事件
// 默认情况下，Node.js 通过将堆栈跟踪打印到 stderr 并使用退出码 1 来处理此类异常，从而覆盖任何先前设置的 process.exitCode
// 为 'uncaughtException' 事件添加处理程序会覆盖此默认行为
process.on('uncaughtException', err => {
  fs.writeSync(1, `捕获的异常：${err}\n`); // 等于   process.stdout.write(`捕获的异常：${err}\n`)
  // 这里做一些最后的清理工作
  // ...
  process.exit(1); // 退出，通过 daemon 重启，不应该恢复这种未知状态的组件，
});

setInterval(() => {
  console.log('这里不会运行');
}, 500);

// 故意引起异常，但不要捕获它。
throw new Error('err');
console.log('这里不会运行');
