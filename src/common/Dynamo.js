const AWS = require('aws-sdk');

let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const documentClient = new AWS.DynamoDB.DocumentClient(options);

const Dynamo = {
  async scan(TableName) {
    const params = {
      TableName
    };

    const data = await documentClient.scan(params).promise();
    
    if (!data) {
      throw Error(
        `There was an error fetching the data in table ${TableName}`
      );
    }

    console.log(data);

    return data.Items;
  },

  async get(Key, TableName) {
    const params = {
      TableName,
      Key
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data in table ${TableName}`
      );
    }

    console.log(data);

    return data.Item;
  },

  async write(data, TableName) {
    const params = {
      TableName,
      Item: data
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting in table ${TableName}`
      );
    }

    return data;
  },

  async update(TableName) {
    const params = {
      TableName
    };

    const data = await documentClient.scan(params).promise();

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data in table ${TableName}`
      );
    }

    console.log(data);

    return data.Item;
  },

  async delete(Key, TableName) {
    const params = {
      TableName,
      Key
    };

    await documentClient.delete(params).promise();
  },
};

module.exports = Dynamo;
