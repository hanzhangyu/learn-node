/**
 * 使用proxy实现observable，具体查看【Proxy & Reflect】或者 http://es6.ruanyifeng.com/#docs/proxy
 * @param obj
 * @returns {boolean|any}
 */

const observable = function(obj) {
  const observerList = new Set();
  return new Proxy(obj, {
    set(target, propKey, value, receiver) {
      observerList.forEach(observer => observer(propKey, value));
      return Reflect.set(target, propKey, value, receiver);
    },
    get(target, propKey, receiver) {
      switch (propKey) {
        case 'subscribe':
          return observerList.add.bind(observerList);
        case 'unsubscribe':
          return observerList.delete.bind(observerList);
        default:
          return Reflect.get(target, propKey, receiver);
      }
    }
  });
};

const obj = {};
const foo = observable(obj);
foo.a = 1;
const observe = function(key, value) {
  if (value < 0) {
    throw new Error('Unexpected minus.');
  }
};
foo.subscribe(observe);
foo.b = -1;
