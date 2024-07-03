const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || '27017';
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.client = MongoClient(`mongodb://${this.host}:${this.port}`);

    this.client.connect((err, client) => {
      if (!err) {
        this.db = client.db(this.database);
        // this.bucket  = new mongodb.GridFSBucket(this.db)
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
    const user = await this.db.collection('users').findOne(query);
    return (user);
  }

  async findFile(query) {
    const modquery = query;
    modquery._id = ObjectId(query._id);
    const file = await this.db.collection('files').findOne(modquery);
    return (file);
  }

  async addFile(object) {
    const file = await this.db.collection('files').insertOne(object);
    // console.log(object);

    const returnFile = {
      id: file.insertedId,
      userId: object.userId,
      name: object.name,
      type: object.type,
      isPublic: object.isPublic,
      parentId: object.parentId,
    };

    if (returnFile.parentId === '0') {
      returnFile.parentId = 0;
    }

    return (returnFile);
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
