const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Encrypter = require('../utils/Encrypter');

const tableName = 'users-table';

const index = async () => {
  const users = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  return API_Responses._200(users);
};

const show = async ({ pathParameters }) => {
  const { username } = pathParameters;

  const user = await Dynamo.get({ username }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: 'User not found' });
  }

  return API_Responses._200(user);
};

const store = async ({ body }) => {
  const { name, username, password, type } = JSON.parse(body);

  const user = await Dynamo.get({ username }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (user) {
    return API_Responses._400({ message: 'Username alredy exists' });
  }

  const encryptedPassword = await Encrypter.hash(password);
  const newUser = await Dynamo.write({ name, username, password: encryptedPassword }, tableName);

  return API_Responses._201(newUser);
};

const update = async ({ body, pathParameters }) => {
  const { username  } = pathParameters;
  const { name, password, type } = JSON.parse(body);

  const user = await Dynamo.get({ username }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: 'User not found' });
  }

  const encryptedPassword = await Encrypter.hash(password);
  const updatedUser = await Dynamo.write({ name, username, password: encryptedPassword }, tableName);

  return API_Responses._200(updatedUser);
};

const destroy = async ({ pathParameters }) => {
  const { username  } = pathParameters;

  const user = await Dynamo.get({ username }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: 'User not found' });
  }

  await Dynamo.delete({ username }, tableName);

  return API_Responses._204();
};

module.exports = { index, show, store, update, destroy };