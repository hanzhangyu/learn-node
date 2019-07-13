/***
 * 在htop中进程为白色，线程为绿色
 */
const path = require('path');
const { fork, exec, execFile, spawn } = require('child_process');
const RUN_FILE_PATH = path.resolve(__dirname, '../../scripts/run.sh');

function run(state) {
  switch (state) {
    case 'fork':
      // region fork
      console.log('process.env.isChild', process.env.isChild);
      const name = process.env.isChild ? 'child' : 'parent';
      setInterval(() => {
        console.log(name, ' alive');
      }, 10000);
      if (!process.env.isChild) {
        fork('./pstree.js', {
          env: { isChild: true }
        });
      }
      // endregion
      break;
    case 'exec':
      // region exec
      // └─ /home/paul/.nvm/versions/node/v12.4.0/bin/node /mnt/f/code/js/learn-node/pstree.js
      //     ├─ /bin/sh -c /mnt/f/code/js/learn-node/scripts/run.sh
      //     │  └─ bash /mnt/f/code/js/learn-node/scripts/run.sh
      //     │     └─ sleep 10s
      //     ├─ libuv线程簇
      exec(RUN_FILE_PATH, { env: { isChild: true } }, (err, stdout, stderr) => {
        if (err) {
          console.error(`执行的错误: ${err}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
      // endregion
      break;
    case 'execFile':
      // region execFile
      // └─ /home/paul/.nvm/versions/node/v12.4.0/bin/node /mnt/f/code/js/learn-node/pstree.js
      //     ├─ bash /mnt/f/code/js/learn-node/scripts/run.sh
      //     │ └─ sleep 10s
      //     ├─ libuv线程簇
      execFile(
        RUN_FILE_PATH,
        { env: { isChild: true } },
        (err, stdout, stderr) => {
          if (err) {
            console.error(`执行的错误: ${err}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        }
      );
      // endregion
      break;
    case 'spawn':
      // region spawn
      // └─ /home/paul/.nvm/versions/node/v12.4.0/bin/node /mnt/f/code/js/learn-node/pstree.js
      //     ├─ bash /mnt/f/code/js/learn-node/scripts/run.sh
      //     │  └─ sleep 10s
      //     ├─ libuv线程簇
      const child = spawn(RUN_FILE_PATH, [], { env: { isChild: true } });
      console.log(child.stdout instanceof require('net').Socket);
      child.stdout.on('data', data => console.log(`stdout: ${data}`));
      child.stderr.on('data', data => console.log(`stderr: ${data}`));
      child.on('close', code => console.log(`close with status of: ${code}`));
      // endregion
      break;
    default:
  }
}

// fork, exec, execFile, spawn
run('spawn');
