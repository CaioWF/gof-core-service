const fileType = require('file-type');
const uuid = require('uuid').v4;
const path = require('path');
const S3 = require('../common/S3');

class UploadFile {
  constructor(bucketName) {
    this.bucketName = bucketName;
    this.mimeTypesPermitted = ['video/mp4'];
  }

  async exec(file, fileName) {
    const extname = path.extname(fileName);
    const key = `${uuid()}${extname}`
    await S3.write(file, key, this.bucketName);

    return `https://gof-core-service-bucket.s3.amazonaws.com/${key}`;
  }
}

module.exports = new UploadFile('gof-core-service-bucket');
