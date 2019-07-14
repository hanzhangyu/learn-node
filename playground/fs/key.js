/***
 * @file 控制字符测试
 * @link https://en.wikipedia.org/wiki/List_of_Unicode_characters
 * @link https://en.wikipedia.org/wiki/ASCII#ASCII_control_characters
 * @desc
 * 键盘输入ESC或者
 * 处理流程见笔记ascii
 * 1. 键盘按下触发ESC keyboard
 * 2. 键盘输出0x1b > /dev/tty
 * 3. tty进程是否处理
 *   1. 有处理，转义成对应的编码
 *     1. c语言为转义序列 Escape sequences （如\e === ESC）
 *     2. 大部分语言为Unicode seq (如\u0001b === ESC)
 *   2. 有处理，直接seq为脱字符Caret notation（如^[ === ESC）
 */
var stdin = process.stdin;
const encoding = process.argv[2] === 'ascii' ? 'ascii' : 'utf8';
console.log(encoding);
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding(encoding);
stdin.on('data', function(key) {
  switch (key) {
    case 'e': // TODO ascii failed
      process.stdout.write('ESC ASCII');
      break;
    case '\u0003':
      process.stdout.write('CTRL + C  UTF8');
      break;
    case '\u001b':
      process.stdout.write('ESC UTF8');
      break;
    case 'd':
      process.exit(0);
  }
});
