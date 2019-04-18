/**
 * 尝试注入mongo，失败
 */
const assert = require('assert');
const promisify = require('util').promisify;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'documents';
// const connect = promisify(MongoClient.connect);
/**
 * curl http://127.0.0.1:3000/mongo?name[$ne]=dddd 注入失败，因为name[$ne]被变成字符串了，而不是{$ne: dddd}
 * @param fastify
 * @param opts
 * @param next
 */
module.exports = function(fastify, opts, next) {
  fastify.get('/', async (request, reply) => {
    const { name = 0 } = request.query;
    const client = await MongoClient.connect(url);
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    const docs = await collection
      .find({
        name
      })
      .toArray();
    console.log(docs);
    await client.close();
    reply.send(docs);
  });

  fastify.get('/set', async (request, reply) => {
    const client = await MongoClient.connect(url);
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    const result = await collection.insertMany([
      { name: 'a' },
      { name: 'b' },
      { name: 'c' }
    ]);
    console.log(result);
    await client.close();
    reply.send(result);
  });
  next();
};
