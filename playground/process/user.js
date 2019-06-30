const fs = require('fs');
const path = require('path');

// region 修改Real uid，修改实际的uid，导致权限可能发生不可逆改动
// console.log(process.getuid(), process.geteuid()); // 0 0
// process.setuid(111);
// console.log(process.getuid(), process.geteuid()); // 1000 1000
// fs.writeFileSync(path.resolve(__dirname, './.temp/user.txt'), 'check use name');
// process.setuid(0); // 这里报错，因为实际的uid不是root之后，不能变回root
// console.log(process.getuid(), process.geteuid());
// endregion

// region 修改 Effective uid，实际的uid没变，过程是可逆的
console.log(process.getuid(), process.geteuid()); // 0 0
process.seteuid(111);
console.log(process.getuid(), process.geteuid()); // 0 1000
fs.writeFileSync(path.resolve(__dirname, './.temp/user.txt'), 'check use name'); // 但是写入文件，ID都是原user
process.seteuid(0);
console.log(process.getuid(), process.geteuid()); // 0 0
// endregion
