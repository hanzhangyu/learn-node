const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const CLIENT_PORT = 3002;
const BIG_DATA = new Array(200).fill('1').join('');

// const encoding = 'identity'; // 不压缩下，Size 为 825B/652B
const encoding = 'gzip'; // gzip下，Size 为 480B/652B

// region client fetch
function fetchFunction() {}
// endregion

// region client
http
  .createServer(function(req, res) {
    switch (req.url) {
      case '/':
        const html = fs
          .readFileSync('./index.html', 'utf8')
          .replace('PLACE_HOLDER', `${BIG_DATA},${fetchFunction.toString()}`);
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Content-Encoding': encoding,
        });
        res.end(encoding === 'identity' ? html : zlib.gzipSync(html));
        break;
      case '/script.js':
        res.end('1');
        break;
      default:
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
