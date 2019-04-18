const delay = (timeout = 3000) =>
  new Promise(resolve => setTimeout(resolve, timeout));

module.exports = { delay };
