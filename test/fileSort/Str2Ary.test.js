const Str2Ary = require('./Str2Ary');

test('initial props', () => {
  const str2Ary = new Str2Ary();
  expect(str2Ary.restStr).toBe('');
  expect(str2Ary.data).toEqual([]);
  expect(str2Ary.length).toBe(0);
  expect(str2Ary.first()).toBe(undefined);
});

test('should data add success', () => {
  const str2Ary = new Str2Ary();
  str2Ary.add('1,1,11,1');
  expect(str2Ary.length).toBe(3);
  expect(str2Ary.restStr).toBe('1');
});

test('should single data add success', () => {
  const str2Ary = new Str2Ary();
  str2Ary.add('1');
  expect(str2Ary.length).toBe(1);
  expect(str2Ary.restStr).toBe('');
});

test('should data shift success', () => {
  const str2Ary = new Str2Ary();
  str2Ary.add('1,2,');
  expect(str2Ary.first()).toBe('1');
  str2Ary.shift();
  expect(str2Ary.first()).toBe('2');
});

test('should data getEnd success', () => {
  const str2Ary = new Str2Ary();
  str2Ary.add('1,1,11,');
  expect(str2Ary.getEnd.bind(str2Ary)).toThrowError('array data exist');
  str2Ary.splice(0, 3);
  expect(str2Ary.getEnd()).toBe('');
});
