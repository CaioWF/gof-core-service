const API_Reponses = require('../common/API_Responses');
const { show, increment } = require('../controllers/ConnectionsController');

const methods = {
  GET: show,
  POST: increment,
};

exports.handler = async (event) => {
  console.log('event', event);

  const method = methods[event.httpMethod];

  if (!method) {
    return API_Reponses._405();
  }

  return method(event);
}