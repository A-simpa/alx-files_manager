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
    const file = await this.db.collection('files').findOne(query);
    if (!file) {
      return file;
    }
    return ({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }

  async addFile(object) {
    const file = await this.db.collection('files').insertOne(object);
    // console.log(object);

    const returnFile = {
      id: file.insertedId,
      userId: object.userId.toString(),
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

  async findAllFile(query, page) {
    const files = await this.db.collection('files').find(query, {
      skip: page * 20,
      limit: 20,
      projection: {
        _id: 1,
        userId: 1,
        name: 1,
        type: 1,
        isPublic: 1,
        parentId: 1,
      },
    }).toArray();
    files.map((file) => ({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    }));
    // console.log(files.length);
    // console.log(await this.nbFiles())
    return (files);
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
