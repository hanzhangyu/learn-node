const fs = require('fs');
const path = require('path');
const inputFilePath = path.resolve(__dirname, '../../files/test.txt');
// const fr = fs.createReadStream(inputFilePath, {
//   encoding: 'utf8'
// });
// let once = false;
// fr.on('readable', async () => {
//   if (once) return;
//   once = true;
//   let data;
//   // data = fr.read(100);
//   let str = '';
//   let restStr = '93';
//   while ((data = fr.read(20))) {
//     console.log(data); // ,92,91,90,89,88,87,8
//     let curData = restStr + data;
//     const ary = data.split(',');
//     if (ary[ary.length - 1] !== '') {
//       restStr = ary.splice(ary.length - 1, 1);
//     }
//     str += data;
//   }
//   console.log('readable', str);
// });
