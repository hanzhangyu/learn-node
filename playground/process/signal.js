// region 常用型号，Windows不支持发送信号，但是Node.js通过process.kill(), 和 subprocess.kill()提供了某些模拟机制。 发送信号0 可以测试进程是否存在。发送SIGINT, SIGTERM, and SIGKILL 使得目标进程无条件终止。
const sign = {
  'SIGUSR1(10)':
    '被Node.js保留用于启动调试器。绑定事件监听器不会阻止调试器的启动。',
  'SIGTERM(15)/SIGINT(1, Ctrl + C)':
    '在非win平台绑定了默认的listener，修改exitCode 为 128 加 sign number。如果两个事件任意一个绑定了新的监听器，原有默认的行为会被移除(Node.js不会结束)。',
  'SIGHUP(1)':
    'win下控制台关闭时，或者一些其他条件（比如webstorm的node进程停止），默认的绑定行为是结束Node.js，添加listener将无法关闭',
  'SIGTERM(15)': '终止',
  'SIGKILL(9)': '不能绑定监听器，强制终止'
};
// endregion

// 阻止SIGHUP信号终端断线
process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setInterval(() => {
  debugger; // 当收到调试信号，短暂延时后，会会捕捉到debugger
  console.log('alive', process.pid);
}, 1000);

setInterval(() => {
  process.kill(process.pid, 'SIGUSR1'); // 启用调试
}, 5000);

process.kill(process.pid, 'SIGHUP'); // 终端断线失败
setTimeout(() => {
  process.kill(process.pid, 'SIGTERM'); // 终端
}, 10000);
