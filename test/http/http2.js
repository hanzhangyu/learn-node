/**
 * @file http2 push
 * @link http://www.ruanyifeng.com/blog/2018/03/http2_server_push.html
 * @todo 实测发现还是等 html 下载完，才发起的 img 请求
 */
const http2 = require('http2');
const fs = require('fs');
const CLIENT_PORT = 3002;
const img = fs.readFileSync('./close.png');

// region client
http2
  .createSecureServer({
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem'),
  })
  .on('error', err => console.error(err))
  .on('stream', (stream, headers) => {
    const url = headers[':path'];
    console.log(url, 'start');
    switch (url) {
      case '/':
        stream.respond({
          'content-type': 'text/html',
          link: '<./img.png>; as=image; rel=preload', // 服务器推送
          ':status': 200,
        });
        stream.end('<h1>Hello World</h1>');
        console.log(url, 'end');
        break;
      case '/img.png': // 可以看到 html 中并没有请求 img，但是发起了这个请求
        stream.respond({
          'Content-Type': 'image/png',
          ':status': 200,
        });
        stream.end(img);
        console.log(url, 'end');
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server https://localhost:${CLIENT_PORT}`);
  });
// endregion
