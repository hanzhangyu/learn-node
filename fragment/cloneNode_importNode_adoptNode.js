/**
 * there's not much of a difference between cloneNode and importNode, before you insert the cloned node into a new document. You can see this difference if you use ownerDocument or related properties (such as baseURI)
 * @type {HTMLElement}
 */

const frame = document.createElement('iframe');
frame.onload = function() {
  const h = frame.contentWindow.document.getElementsByTagName('H1')[0];
  console.log(h.baseURI);
  // const x = document.importNode(h, true); // this will clone the h1 in the iframe to body, get the new document(/node/index.html)
  const x = document.adoptNode(h); // this will move the h1 in the iframe to body, get the new document
  // const x = h.cloneNode(true); // this will clone the h1 in the iframe to body, get the origin document(/node/sub.html)
  console.log(x.baseURI);
  document.body.appendChild(x);
};
frame.src = './sub.html';
document.body.appendChild(frame);
