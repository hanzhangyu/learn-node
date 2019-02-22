const fs = require("fs");

const buf = "123122";
fs.writeSync(process.stdout.fd, buf, 'utf8');