const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const fileClient = require('../utils/fileCreate');

class FilesController {
  static async postUpload(req, res) {
    const token = req.get('X-Token');
    const file = {
      name: req.body.name,
      type: req.body.type,
      parentId: req.body.parentId,
      isPublic: req.body.isPublic || false,
    };
    const { data } = req.body;

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    if (!file.name) {
      return res.status(400).send({ error: 'Missing name' });
    }

    const types = ['file', 'image', 'folder'];
    if ((!file.type) || !(types.includes(file.type))) {
      return res.status(400).send({ error: 'Missing type' });
    }

    if ((!data) && (file.type !== 'folder')) {
      return res.status(400).send('Missing data');
    }

    if (file.parentId) {
      const isFile = await dbClient.findFile({ _id: ObjectId(file.parentId) });
      //   console.log(isFile);
      if (isFile) {
        if (isFile.type !== 'folder') {
          return res.status(400).send('Parent is not a folder');
        }
        file.parentId = ObjectId(file.parentId);
      } else {
        return res.status(400).send('Parent not found');
      }
    } else {
      file.parentId = '0';
    }

    const formatFile = {
      userId: ObjectId(userId),
      name: file.name,
      type: file.type,
      parentId: file.parentId,
      isPublic: file.isPublic,
    };
    if (file.type === 'folder') {
      const returnFile = await dbClient.addFile(formatFile);
      return res.status(201).send(returnFile);
    }
    const localPath = await fileClient.createFile(data);
    formatFile.localPath = localPath;
    // console.log(localpath);
    const returnFile = await dbClient.addFile(formatFile);
    // console.log(returnFile);
    return res.status(201).send(returnFile);
  }

  static async getShow(req, res) {
    const { id } = req.params;
    const token = req.get;
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const file = await dbClient.findFile({ _id: id, userId: ObjectId(userId) });
    if (!file) {
      return res.status(404).send({ error: 'Not found' });
    }
    return res.status(200).send(file);
  }

  //   static async getIndex(req, res) {

  //   }
}
module.exports = FilesController;
