const http = require('http');
const fs = require('fs');
const CLIENT_PORT = 3002;

const connection = 'close'; // 'keep-alive' | 'close'

const MODE = {
  // 浏览器的默认选项
  // 限制网络的情况下（为了显示更明显，发现在 chrome 下速度过快时，第一组 TCP 通道没有对齐不好看）
  // keep-alive 每次有多个 tcp 通道同时打开，单个 TCP 通道串行
  ['keep-alive']: {
    img: fs.readFileSync('keep-alive.png'),
  },
  // 可以看到除了 html script 其他的 Connection ID 都不一样
  ['close']: {
    img: fs.readFileSync('keep-alive.png'),
  },
};

const img = MODE[connection].img;

// region client fetch
function fetchFunction() {
  const wrap = document.createElement('div');
  wrap.innerHTML = new Array(20)
    .fill(0)
    .map((value, index) => `<img src="test${index}.png" alt=""/>`)
    .join('\n');
  document.body.appendChild(wrap);
}
// endregion

// region client
http
  .createServer(function(req, res) {
    switch (req.url) {
      case '/':
        const html = fs.readFileSync('./index.html', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html.replace('PLACE_HOLDER', fetchFunction.toString()));
        break;
      case '/script.js':
        res.end('1');
        break;
      default:
        res.writeHead(200, {
          'Content-Type': 'image/png',
          Connection: connection,
        });
        res.end(img);
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
