/**
 * tty 传入的 stdin 很奇怪，有时候 parent 收得到 有时候收不到，但是只会流向 child 或者 parent 中的一个
 */
const fork = require('child_process').fork;
const readline = require('readline');

/**
 * @conclusion
 *  1. child_process.fork will create a new child process
 */

if (!process.env.isChild) {
  fork(__filename, [], {
    env: {
      isChild: true
    }
  });
}

const uid = process.env.isChild? '[CHILD]': '[PARENT]';

console.log(`${uid}Current pid: ${process.pid}`, process.env.isChild);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(uid+ 'exit? \n', answer => {
  console.log(`${uid}bye: ${answer}\n`);
  rl.close();
});
