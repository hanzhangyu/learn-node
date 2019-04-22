/**
 * TODO Q: 事件循环与nextTickQueue的错误会导致系统崩溃, Promise.resolve 的不会
 */
Promise.resolve().then(() => {
  // async function will lost the context
  throw new Error('Promise.resolve exception');
  /**
     JS 内建的异常特性是基于调用栈的，而从事件队列取出一个回调执行时，该回调函数会在调用栈的最顶层执行。所以也就无法中断程序。
     (node:12228) UnhandledPromiseRejectionWarning: Error: exception
     at Promise.resolve.then (/Users/paulhan/code/js/node/nodejs/error.js:2:9)
     at process._tickCallback (internal/process/next_tick.js:68:7)
     at Function.Module.runMain (internal/modules/cjs/loader.js:745:11)
     at startup (internal/bootstrap/node.js:236:19)
     at bootstrapNodeJSCore (internal/bootstrap/node.js:560:3)
   */
});

process.nextTick(() => {
  // async function will lost the context
  throw new Error('nextTick exception');
});

console.log('start');

setInterval(() => {
  console.log('setInterval foo');
}, 1000);

setInterval(() => {
  console.log('setInterval');
  throw new Error('exception in setInterval');
}, 1000);

// process.on('uncaughtException', (err) => {
//     console.error('uncaughtException:\n', err, '\n');
// });
//
// process.on('unhandledRejection', (reason, p) => {
//     console.error('unhandledRejection:\n', reason, p, '\n');
// });
