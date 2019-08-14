module.exports = function(fastify, opts, next) {
  fastify.register(require('fastify-formbody')); // 在该作用域下生效

  let i = 0;
  fastify.get('/user', async (request, reply) => {
    console.log(request.headers.referer); // nginx http://$hostx
    reply.type('application/json').code(200);
    console.log('request.body', request.body);
    console.log('request.query', request.query);
    console.log('request.params', request.params);
    // test for TTFB
    // await delay(40000);
    return { hello: i++ };
  });

  fastify.post('/user', async (request, reply) => {
    console.log('request.body', request.body);
    console.log('request.query', request.query);
    console.log('request.params', request.params);
    console.log('request.headers', request.headers);
    // reply.header('Access-Control-Allow-Origin', '*');
    return { hello: i++ };
  });
  next();
};
