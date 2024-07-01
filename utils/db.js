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
    return new Promise((resolve) => {
      const collection = this.db.collection('users');
      resolve(collection.countDocuments((err, res) => res));
    });
  }

  async nbFiles() {
    return new Promise((resolve) => {
      const collection = this.db.collection('files');
      resolve(collection.countDocuments((err, res) => res));
    });
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
