/**
 * 1,1,11,1, => [1,1,11,1] and ''
 * 1,1,11,1 => [1,1,11] and '1'
 */
class Str2Ary {
  constructor() {
    this.restStr = ''; // string
    this.data = []; // string[]
  }

  get length() {
    return this.data.length;
  }

  shift() {
    return this.data.shift();
  }

  splice(...restProps) {
    return this.data.splice(...restProps);
  }

  add(str) {
    str = this.restStr + str;
    this.data.push(...str.split(','));
    this.restStr = this.data.splice(this.data.length - 1, 1).toString();
  }

  min() {
    return this.data[0];
  }

  getEnd() {
    if (this.data.length) throw new Error('array data exist');
    const temp = this.restStr;
    this.restStr = '';
    return temp;
  }
}

module.exports = Str2Ary;
