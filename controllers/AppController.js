const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    return res.send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    }).status(200);
  }

  static async getStats(req, res) {
    return res.status(200).send({
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}

module.exports = AppController;
