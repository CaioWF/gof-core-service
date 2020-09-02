const API_Reponses = require('../common/API_Responses');
const { index, show, store, update, destroy } = require('../controllers/UsersController');

const methods = {
  GET: (event) => event.pathParameters && event.pathParameters.username ? show(event) : index(event),
  POST: store,
  PUT: update,
  DELETE: destroy,
};

exports.handler = async (event) => {
  console.log('event', event);

  const method = methods[event.httpMethod];

  if (!method) {
    return API_Reponses._405();
  }

  return method(event);
}