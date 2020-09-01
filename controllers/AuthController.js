const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Encrypter = require('../utils/Encrypter');
const JWT = require('../utils/JWT');

const tableName = 'users-table';

const authenticate = ({ body }) => {
  const { username, password } = JSON.parse(body);

  const user = await Dynamo.get({ username }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: 'User not found' });
  }

  const passwordIsValid = Encrypter.compare(password, user.password);

  if (!passwordIsValid) {
    return API_Responses._401({ message: 'Unauthorized' });
  }

  const accessToken = JWT.encrypt(username);

  return API_Responses._200({ accessToken });
};

module.exports = { authenticate };