const fork = require('child_process').fork;
const readline = require('readline');



/**
 * @conclusion
 *  1. child_process.fork will create a new child process
 */

if (!process.env.isChild) {
    fork(__filename, [], {
        env: {
            isChild: true,
        }
    })
}

console.log(`Current pid: ${process.pid}`, process.env.isChild);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question('exit? ' + process.env.isChild + '\n', (answer) => {
    console.log(`bye: ${answer}` + process.env.isChild + '\n');
    rl.close();
});
