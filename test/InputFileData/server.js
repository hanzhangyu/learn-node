const http = require('http')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty');
// Create an HTTP server
const srv = http
    .createServer((req, res) => {
        console.log(req.method);
        let imgData = '';
        if (req.method === 'POST') {
            const form = new multiparty.Form();
            form.on('part', function (part) {
                if (part.filename === null) return part.resume();
                part
                    .pipe(fs.createWriteStream(path.resolve(__dirname, part.filename)))
                    .on('finish', () => {
                        const buff = fs.readFileSync(path.resolve(__dirname, part.filename));
                        const base64data = buff.toString('base64');
                        console.log(base64data);
                    });
                // part.pipe(process.stdout);
            });

            form.on('close', function () {
                res.writeHead(302, {
                    'Location': '/img',
                });
                res.end();
            });
            form.parse(req);
            return;
        }
        // 暂存请求体信息
        let body = '';
        console.log(req.url)
        req.on('data', function (chunk) {
            body += chunk
            console.log('chunk:', chunk)
        })
        // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        req.on('end', function () {
            // 解析参数
            body = querystring.parse(body) // 将一个字符串反序列化为一个对象
            console.log('body:', body)
            if (req.url === '/img') {
                res.setHeader('Content-Type', 'text/html;charset=UTF-8');
                res.write(`<img src="${body.file}"/>`);
                res.end();
            } else {
                // 输出表单
                fs.createReadStream(path.resolve(__dirname, './index.tpl')).pipe(res);
            }
        })
    })
    .listen(3000, '127.0.0.1', () => {
        console.log('opened server on', srv.address())
    })
