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
}
const dbClient = new DBClient();
module.exports = dbClient;
