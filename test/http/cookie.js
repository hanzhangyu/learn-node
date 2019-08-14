const http = require('http');
const fs = require('fs');
const CLIENT_PORT = 3002;

// region client fetch
function fetchFunction() {
  console.log(document.cookie);
}
// endregion

// region client
http
  .createServer(function(req, res) {
    switch (req.url) {
      case '/':
        const html = fs.readFileSync('./index.html', 'utf8');
        if (req.headers['host'] === 'a.ph.com') {
          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Set-Cookie': ['age=4; domain=ph.com'], // 设置失败被忽略，不能跨域设置 domain
          });
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Set-Cookie': ['id=1; max-age=3', 'name=2', 'sex=3; HttpOnly'], // 会变成两个 Set-Cookie 都会生效
          });
        }
        res.end(html.replace('PLACE_HOLDER', fetchFunction.toString()));
        break;
      case '/script.js':
        res.end('1');
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
