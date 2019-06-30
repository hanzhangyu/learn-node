const fs = require('fs');

/**
 * 使用htop，可以看到多个CPU core都被满载了
 * 1. Nodejs 同步部分的确为单线程
 * 2. 实现 异步的事件通知 的 libuv 的线程池的确使用了多核
 */
for (let i = 0; i < 900000; i++) {
  (function(id) {
    // fs.readdir('.', function() {
    //   console.log('readdir %d finished.', id);
    // });
    setTimeout(() => {
      console.log(id);
    }, 1000);
  })(i);
}
