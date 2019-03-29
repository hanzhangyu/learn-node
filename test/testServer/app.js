const fastify = require('fastify')({
  logger: true
});

const delay = (timeout = 3000) =>
  new Promise(resolve => setTimeout(resolve, timeout));

fastify.get('/', async (request, reply) => {
  console.log(request.headers.referer); // nginx http://$hostx
  reply.type('application/json').code(200);
  // test for TTFB
  await delay(40000);
  return { hello: 'world' };
});

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
