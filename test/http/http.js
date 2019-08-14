const http = require('http');
const fs = require('fs');
const SERVER_PORT = 3001;
const CLIENT_PORT = 3002;
let i = 1;

const mode = 'etagNoCache';

const CACHE_CONTROL = {
  // 在 maxAge 秒内，不经过服务端验证，修改资源的不到更新无效，过期会请求服务器
  maxAge: {
    'Cache-Control': 'max-age=3',
  },
  // 会发送请求至服务器验证，如果返回了 304 浏览器将忽略服务器数据，直接使用 缓存
  etagNoCache: {
    'Cache-Control': 'max-age=3000, no-cache',
    'Last-Modified': '111',
    Etag: '222',
  },
  // 没有带 no-cache，还是会直接走缓存
  etag: {
    'Cache-Control': 'max-age=3000',
    'Last-Modified': '111',
    Etag: '222',
  },
  // 设置了 no-store 忽略所有设置的缓存
  etagNoStore: {
    'Cache-Control': 'max-age=3000, no-store',
    'Last-Modified': '111',
    Etag: '222',
  },
};

// region server
http
  .createServer(function(request, response) {
    console.log('receive request:', request.url, request.method);

    // 实际上浏览器只对于 默认不允许 的 Cors请求 只校验 OPTIONS
    if (request.method === 'OPTIONS') {
      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Test-Cors, max-stale',
        'Access-Control-Allow-Methods': 'POST, DELETE, PUT',
        'Access-Control-Max-Age': '1000', // 1000秒 以内不必浏览器发送 预请求，设置 disable cache 将会失效
      });
    } else {
      response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    }

    response.end('hello');
  })
  .listen(SERVER_PORT, () => {
    console.log('opened server');
  });
// endregion

// region client fetch
function fetchFunction() {
  fetch('http://localhost:3001', {
    method: 'PUT',
    headers: {
      'X-Test-Cors': 'hello cors',
      'max-stale': '100',
    },
  });
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
        const etag = req.headers['if-none-match'];
        console.log(etag);
        if (etag === '222') {
          res.writeHead(304, {
            'Content-Type': 'text/javascript',
            // ...CACHE_CONTROL[mode], // 这里可以不用加 因为 Date 会被自动加上，符合 304 定义所需的请求头
          });
          res.end('will be ignored');
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/javascript',
            ...CACHE_CONTROL[mode],
          });
          res.end(`console.log('script:', ${i++})`);
        }
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
