/**
 * @file 测试unlink一个打开的fd，似乎发现了一个bug
 * @link https://github.com/nodejs/help/issues/2046
 */

const fs = require('fs');
const { fork } = require('child_process');
const path = require('path');

const FILE_PATH = path.resolve(__dirname, '../../files/temp.txt');

if (!process.env.isChild) {
  fork('./unlink-otherps-opend.js', {
    env: { isChild: true }
  });

  const fd = fs.openSync(FILE_PATH);

  setInterval(() => console.log(fd), 1000);
}

setTimeout(()=>{
  try {
    fs.unlinkSync(FILE_PATH);
  } catch (e) {
    console.log(e)
  }
},3000);
