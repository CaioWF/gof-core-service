const API_Reponses = require('../common/API_Responses');
const { authenticate } = require('../controllers/AuthController');

const methods = {
  POST: authenticate,
};

exports.handler = async (event) => {
  console.log('event', event);

  const method = methods[event.httpMethod];

  if (!method) {
    return API_Reponses._405();
  }

  return method(event);
}