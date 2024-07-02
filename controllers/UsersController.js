const sha1 = require('sha1');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    let { password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    } if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    } if (await dbClient.userExist(email)) {
      return res.status(400).send({ error: 'Already exist' });
    }

    password = sha1(password);
    const id = await dbClient.addUser(email, password);
    return res.status(201).send({ id, email });
  }

  static async getMe(req, res) {
    const token = req.get('X-Token');
    // console.log(token)-
    const id = await redisClient.get(`auth_${token}`);
    const user = await dbClient.findUser({ _id: ObjectId(id) });

    if (user === null) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    return res.send({
      id,
      email: user.email
    });
  }
}

module.exports = UsersController;
