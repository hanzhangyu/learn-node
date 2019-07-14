/***
 * @file 控制字符测试
 * @link https://en.wikipedia.org/wiki/List_of_Unicode_characters
 * @link https://en.wikipedia.org/wiki/ASCII#ASCII_control_characters
 * @desc
 * 键盘输入ESC或者
 * 1. 普通字符，直接由terminal传入tty
 * 2. 控制字符（Control characters），tty收到之后会进行
 *   1. 键盘按下ESC
 *   2. 键盘输出0x1b > /dev/tty
 *   3. tty进程是否处理
 *     1. 有处理，转义成对应的编码
 *       1. c语言为转义序列 Escape sequences （如\e === ESC）
 *       2. 大部分语言为Unicode seq (如\u0001b === ESC)
 *     2. 无处理
 *       1. 特殊字符（Special characters），根据tty设置，`stty -a`，如`CTRL + C` 发送信号SIGINT
 *       2. 其他直接seq为脱字符Caret notation（如^[ === ESC* ）
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
