// region multipleResolves
// 解决不止一次。
// 拒绝不止一次。
// 解决后拒绝。
// 拒绝后解决。
// process.on('multipleResolves', (type, promise, reason) => {
//   console.error('multipleResolves', type, promise, reason);
//   setImmediate(() => process.exit(1));
// });
//
// new Promise((resolve, reject) => {
//   resolve('I am the real resolved data');
//   resolve('I am redundant');
// });
// endregion

// region rejectionHandled & unhandledRejection
const p = new Promise((resolve, reject) => {
  reject(new Error('err1'));
});
setImmediate(() => {
  p.catch(e => console.warn('catch:', e)); // 但在处理过程中获得了拒绝处理函数
});
process.on('unhandledRejection', (reason, promise) => {
  // Promise 对象已经在 'unhandledRejection' 事件中触发
  console.log('unhandledRejection', reason, promise);
});
// 错误处理晚于一个事件循环时触发
process.on('rejectionHandled', promise => {
  console.log('rejectionHandled', promise);
});
// endregion
