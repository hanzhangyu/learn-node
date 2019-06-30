const path = require('path');

// region 参数
// 返回一个表示操作系统CPU架构的字符串，Node.js二进制文件是为这些架构编译的。 例如 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 或 'x64'。
console.log(`This processor architecture is ${process.arch}`);

// 第一个元素是 process.execPath
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

// 返回第一个参数的原始值，比如说：node a.js 则为 node
console.log('process.argv0: ', process.argv0);

// node --harmony script.js --version
// 返回启动 Node.js 进程的可执行文件的绝对路径名，['/usr/local/bin/node', 'script.js', '--version']
console.log('process.execPath: ', process.execPath);
// Node.js特定的命令行选项，紧跟在node之后，子进程与父进程一致，['--harmony']
console.log('process.execArgv: ', process.execArgv);
// endregion

// region chdir
const curPath = path.resolve();
console.log('current cwd工作目录: ', process.cwd());
process.chdir('/tmp');
console.log('after changed cwd: ', process.cwd());
process.chdir(curPath);
console.log('move back cwd: ', process.cwd());
// endregion

// region 使用量
const startUsage = process.cpuUsage();
const now = Date.now();
while (Date.now() - now < 500);
console.log(process.cpuUsage(startUsage));

console.log(process.memoryUsage());
// endregion

// region process warning event
process.on('warning', warning => {
  console.warn(warning.name); // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code); // 'MY_WARNING'
  console.warn(warning.stack); // Stack trace
  console.warn(warning.detail); // 'This is some additional information'
});
//参数必须是string或Error
process.emitWarning('Something happened!', {
  // 如果警告type是DeprecationWarning，会涉及如下额外的处理:
  // - 如果命令行标识包含--throw-deprecation，deprecation warning会作为异常抛出，而不是作为事件被发出。
  // - 如果命令行标识包含--no-deprecation，deprecation warning会被忽略。
  // - 如果命令行标识包含--trace-deprecation，deprecation warning及其全部堆栈信息会被打印到stderr。
  type: 'DeprecationWarning',
  code: 'MY_WARNING',
  detail: 'This is some additional information'
});
// endregion

// region 进程信息
// 当值不是字符串、数字或布尔值时，Node.js 的未来版本可能会抛出错误。
// process.env 在 Worker 线程中是只读的。
console.log('process.env.PWD', process.env.PWD); // 包含用户环境的对象，该对象初始化时会从启动读取环境变量，修改不会影响系统环境变量

console.log('process.debugPort', process.debugPort);

console.log('process.mainModule', process.mainModule.filename);

console.log('process.platform', process.platform); // 'aix'|'android'|'darwin'|'freebsd'|'linux'|'openbsd'|'sunos'|'win32'

console.log('process.pid', process.pid); // 进程的PID
console.log('process.ppid', process.ppid); // 父进程的进程ID
console.log('process.title', process.title); // 当前进程在 ps 命令中显示的进程名字（也就是ps中的COMMAND）
setTimeout(() => {
  process.title = 'hello node';
  console.log('changed process.title', process.title); // 更新COMMAND
}, 5000);

console.log('process.uptime', process.uptime()); // 运行时长
console.log('process.version', process.version); // Node.js 版本
console.log('process.versions', process.versions); // Node.js和其依赖的版本信息。 process.versions.modules表明了当前ABI版本，此版本会随着一个C++API变化而增加。 Node.js会拒绝加载模块，如果这些模块使用一个不同ABI版本的模块进行编译。
// endregion

setInterval(() => {
  console.log('alive', process.pid, process.ppid);
}, 1000);
