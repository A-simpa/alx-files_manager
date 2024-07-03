const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  static async getConnect(req, res) {
    let key = req.get('Authorization');
    // console.log(key);
    key = key.substring(6);
    // console.log(key);
    const credentials = Buffer.from(key, 'base64').toString('utf-8');
    // console.log(credentials);
    const [email, password] = credentials.split(':');
    // console.log(email);
    // console.log(password);

    const user = await dbClient.findUser({ email, password: sha1(password) });
    if (user === null) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const authToken = `auth_${token}`;
    await redisClient.set(authToken, user._id.toString(), 86400);
    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.get('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    if (userId === null) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

module.exports = AuthController;
