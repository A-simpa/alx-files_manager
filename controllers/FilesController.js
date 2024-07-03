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
      data: req.body.data,
    };

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    if (!file.name) {
      return res.status(400).send({ error: 'Missing name' });
    }

    const types = ['file', 'image', 'folder'];
    if (!file.type || !(types.includes(file.type))) {
      return res.status(400).send({ error: 'Missing type' });
    }

    if ((!file.data) && (file.type !== ('folder'))) {
      return res.status(400).send('Missing data');
    }

    if (file.parentId) {
      const isFile = await dbClient.findFile({ _id: file.parentId });
      if (isFile) {
        if (isFile.type !== 'folder') {
          return res.status(400).send('Parent is not a folder');
        }
        file.parentId = isFile._id;
      } else {
        return res.status(400).send('Parent not found');
      }
    } else {
      file.parentId = '0';
    }

    file.userId = userId;
    if (file.type === 'folder') {
      const returnFile = await dbClient.addFile(file);
      return res.status(201).send(returnFile);
    }
    const localPath = await fileClient.createFile(file.data);
    file.localPath = localPath;
    // console.log(localpath);
    const returnFile = await dbClient.addFile(file);
    // console.log(returnFile);
    return res.status(201).send(returnFile);
  }
}
module.exports = FilesController;
