const worker = require('worker_threads');
const readline = require('readline');

const {
    Worker, isMainThread, parentPort, workerData, threadId
} = require('worker_threads');

/**
 * @run
 *  node --experimental-worker workerThreads.js
 * @conclusion
 *  1. Worker will create multiple environments running on independent threads
 *  2. The Input can not send to workers directly. Should use the message channels between them
 */

if (isMainThread) {
    new Promise((resolve, reject) => {
        console.log(123);
        const worker = new Worker(__filename, {
            workerData: 'console.log(script)'
        });
        worker.on('message', (data) => {
            console.log('onmessage', data);
            resolve();
        });
        worker.on('error', reject);
        worker.on('online', (data) => {
            console.log('online', data);
        });
        worker.on('exit', (code) => {
            console.log('onexit', code);
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
} else {
    console.log('workerData', workerData);
    parentPort.postMessage(JSON.stringify(workerData));
}

console.log(`Current pid: ${process.pid}`, isMainThread);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('exit? ' + isMainThread + threadId + '\n', (answer) => {
    console.log(`bye: ${answer}` + isMainThread + '\n');
    if (isMainThread) {
        rl.question('mainexit? ' + isMainThread + '\n', (answer) => {
            rl.close();
        });
    } else {
        rl.close();
    }
});
