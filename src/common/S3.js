const AWS = require('aws-sdk');
const SignedUrl = require('../utils/SignedUrl');

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    s3ForcePathStyle: true,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
    endpoint: new AWS.Endpoint('http://localhost:9000'),
  };
}

options = {...options, region: 'us-east-1', signatureVersion: 'v4'}

const s3Client = new AWS.S3(options);

const S3 = {
  async get(fileName, bucket) {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    let data = await s3Client.getObject(params).promise();

    if (!data) {
      throw Error(`Failed to get file ${fileName}, from ${bucket}`);
    }

    if (/\.json$/.test(fileName)) {
      data = JSON.parse(data.Body.toString());
    }
    return data;
  },

  async write(data, fileName, bucket) {
    const params = {
      Bucket: bucket,
      Body: data,
      Key: fileName,
    };

    const newData = await s3Client.putObject(params).promise();

    if (!newData) {
      throw Error('there was an error writing the file');
    }

    return newData;
  },

  async url(method, filename, bucket) {
    const params = {
      Bucket: bucket,
      Key: filename,
      Expires: 60 * 5,
    };

    const signedUrl = await s3Client.getSignedUrl(method, params);

    return signedUrl;
  }
};

module.exports = S3;
