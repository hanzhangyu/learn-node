const fastify = require('fastify')({
  logger: {
    prettyPrint: true
  }
});

['base', 'mongo'].forEach(name =>
  fastify.register(require('./routes/' + name), { prefix: '/' + name })
);

fastify.listen(3000, (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
