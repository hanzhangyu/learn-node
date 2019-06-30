setImmediate(() => {
  console.log('setTimeout'); // ode.js 进程将在没有调度工作时退出
});

let fired = false;
process.on('beforeExit', exitCode => {
  console.log('beforeExit');
  fired ||
    setTimeout(() => {
      // 使用异步，从而导致 Node.js 进程继续，最后调度完重新触发 beforeExit
      fired = true;
      console.log(exitCode);
    }, 100);
});

// region 显式终止不会触发beforeExit
// process.exit(0);
// throw new Error('err');
// endregion
