module.exports = function(fastify, opts, next) {
  fastify.get('/user', async (request, reply) => {
    console.log(request.headers.referer); // nginx http://$hostx
    reply.type('application/json').code(200);
    // test for TTFB
    await delay(40000);
    return { hello: 'world' };
  });
  next();
};
