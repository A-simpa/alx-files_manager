const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return new Promise((resolve) => {
      this.client.get(key, (err, reply) => {
        resolve(reply);
      });
    });
  }

  async set(key, val, time) {
    return new Promise((resolve) => {
      this.client.set(key, val, 'EX', time);
      resolve();
    });
  }

  async del(key) {
    return new Promise((resolve) => {
      this.client.del(key);
      resolve();
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
