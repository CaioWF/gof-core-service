const path = require('path');
const Uuid = require('./uuid');
const S3 = require('../common/S3');

class SignedUrl {
  constructor(bucketName, method, filename) {
    this.bucketName = bucketName;  }

  async generate(method, filename) {
    const signedUrl = await S3.url(method, filename, this.bucketName);

    return signedUrl;
  }
}

module.exports = new SignedUrl('gof-core-service-bucket');
