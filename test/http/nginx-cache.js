const http = require('http');
const fs = require('fs');
const CLIENT_PORT = 3002;
let i = 0;

const mode = 'vary';

const CACHE = {
  ['proxy']: {
    cache: [
      'max-age=3',
      // 设置代理服务器可以缓存10秒，每过3面，浏览器拿到新数据，重新使用 max-age
      's-maxage=10',
    ],
  },
  ['no-store']: {
    cache: [
      'max-age=3, s-maxage=10',
      // 忽略所有缓存
      'no-store',
    ],
  },
  ['private']: {
    cache: [
      'max-age=3, s-maxage=10',
      // 只能使用浏览器缓存
      'private',
    ],
  },
  ['vary']: {
    cache: ['max-age=3, s-maxage=100'],
    // 只有当 X-custom-ph 值一致，才会缓存，比如 User-Agent
    // 这里设置的两个缓存都会失效
    header: { Vary: 'X-custom-ph' },
  },
};

// region client fetch
function fetchFunction() {
  const button = document.createElement('button');
  button.innerText = 'click me';
  document.body.appendChild(button);

  button.onclick = function() {
    fetch('./data', {
      headers: { 'X-custom-ph': i++ },
    })
      .then(res => res.text())
      .then(console.log);
  };
}
// endregion

// region client
http
  .createServer(function(req, res) {
    console.log('receive', req.url);
    switch (req.url) {
      case '/':
        const html = fs.readFileSync('./index.html', 'utf8');
        res.writeHead(200, {
          'Content-Type': 'text/html',
        });
        res.end(
          html.replace('PLACE_HOLDER', `i=1,${fetchFunction.toString()}`),
        );
        break;
      case '/data':
        res.writeHead(200, {
          'Cache-Control': CACHE[mode].cache,
          ...(CACHE[mode].header || {}),
        });
        setTimeout(() => {
          res.end(i++ + '');
        }, 1000);
        break;
      case '/script.js':
        res.end('');
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
