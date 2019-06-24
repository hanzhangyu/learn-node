function* numbers() {
  console.log('function start.');

  var v1 = yield 0;
  console.log('v1 = ' + v1);

  var v2 = yield 1;
  console.log('v2 = ' + v2, 'v1 = ' + v1);

  return 5;
}

// const it = numbers();
// console.log("next0", it.next());
// console.log("return", it.return(2222));
// console.log("next1", it.next(1).value);
// console.log("next2", it.next(2));

function foo() {
  var state = 0;
  var values = [];
  function process(v) {
    values[state] = v;
    switch (state) {
      case 0:
        console.log('function start.');
        return 0;
      case 1:
        console.log('v1 = ' + v);
        return 1;
      case 2:
        console.log('v2 = ' + v);
        return 5;
    }
  }
  return {
    next(val) {
      if (state > 2) return { value: undefined, done: true };
      const value = process(val);
      return {
        value,
        done: state++ >= 2
      };
    },
    throw(e) {
      throw e;
    },
    return(value) {
      state = 3;
      return {
        value,
        done: true
      };
    }
  };
}

const it2 = foo();
console.log('next0', it2.next());
// console.log("return", it2.return(2222));
console.log('next1', it2.next(1).value);
console.log('next2', it2.next(2));
