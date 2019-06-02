#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const filePath = path.resolve(__dirname, '../files/big-sort-file.txt');
const fw = fs.createWriteStream(filePath);
const numberSeparator = str => Number(str.replace(/_/g, ''));
const LENGTH = numberSeparator('10_000_000');
const STEP = numberSeparator('10_0000');
(async function run() {
  for (let i = LENGTH - 1; i >= 0; i -= STEP) {
    const str = Array.from(Array(STEP).keys())
      .map(val => i - val)
      .join(',');
    const notBackPressure = fw.write(str + ',');
    if (!notBackPressure) {
      await new Promise(resolve => fw.once('drain', resolve));
    }
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(i.toString());
  }
  fw.end();
})();
