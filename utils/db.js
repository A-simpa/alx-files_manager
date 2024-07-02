const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || '27017';
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.client = MongoClient(`mongodb://${this.host}:${this.port}`);

    this.client.connect((err, client) => {
      if (!err) {
        this.db = client.db(this.database);
      }
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    // console.log(this.db)
    return this.db.collection('users').estimatedDocumentCount();
  }

  async nbFiles() {
    return this.db.collection('files').estimatedDocumentCount();
  }

  async userExist(email) {
    const isUser = await this.db.collection('users').findOne({ email });
    return isUser !== null;
  }

  async addUser(email, password) {
    const user = await this.db.collection('users').insertOne({ email, password });
    return user.insertedId;
  }

  async findUser(query) {
    console.log(query);
    const isUser = await this.db.collection('users').findOne(query);
    return (isUser);
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
