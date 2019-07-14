const fs = require('fs');
const path = require('path');

const FILE_PATH = path.resolve(__dirname, '../../files/temp.txt');
const fd = fs.openSync(FILE_PATH, 'w+');
const fd2 = fs.openSync(FILE_PATH, 'w+');
console.log(fd, fd2);
// 新打开的fd会指向一个新的file结构体
fs.writeSync(fd, "hello");
fs.writeSync(fd, "world");
fs.writeSync(fd2, "world");
// worldwrold
