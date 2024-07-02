const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UserController {
  static async postNew(req, res) {
    const { email } = req.body;
    let { password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing password' });
    } if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    } if (await dbClient.userExist(email)) {
      return res.status(400).send({ error: 'Already exist' });
    }

    password = sha1(password);
    const id = await dbClient.addUser(email, password);
    return res.status(201).send({ id, email });
  }
}

module.exports = UserController;
