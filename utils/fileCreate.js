const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileClient {
  constructor() {
    try {
      this.folder = fs.mkdirSync('/tmp/files_manager');
    } catch (err) {
      this.folder = '/tmp/files_manager';
    }
  }

  async createFile(data) {
    let folder;
    if (process.env.FOLDER_PATH) {
      try {
        folder = fs.mkdirSync(process.env.FOLDER_PATH);
      } catch (err) {
        folder = process.env.FOLDER_PATH;
      }
    } else {
      folder = this.folder;
    }
    // console.log(folder);
    const localpath = path.resolve(folder, uuidv4());
    const binaryData = Buffer.from(data, 'base64');

    fs.writeFileSync(localpath, binaryData);
    // console.log(localpath);
    return (localpath);
  }
}

const fileClient = new FileClient();
module.exports = fileClient;
