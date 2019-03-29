const myEmitter = new (require('events')).EventEmitter();
const readline = require('readline');
const fork = require('child_process').fork;

/**
 * @conclusion
 *  1. events.EventEmitter can only communicate in the same process
 *  2. kill the child process cannot affect the main process,, But kill the main process will affect the child.
 */

// Only do this once so we don't loop forever
myEmitter.on('newListener', (event, listener) => {
  console.log('newListener', event, process.env.isChild, '\n');
});
myEmitter.on('event', () => {
  console.log('event', process.env.isChild, '\n');
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
if (!process.env.isChild) {
  fork(__filename, [], {
    env: {
      isChild: true
    }
  });
}

rl.question(
  'question: What do you think of Node.js? ' + process.env.isChild + '\n',
  answer => {
    console.log(
      `answer: Thank you for your valuable feedback: ${answer}` +
        process.env.isChild +
        '\n'
    );
    myEmitter.emit('answered\n');
    setTimeout(() => {
      myEmitter.emit('event');
      rl.question('exit?' + process.env.isChild + '\n', answer => {
        rl.close();
      });
    }, 2000);
    //   rl.close(); // using this method will cause the system to get stuck
  }
);
