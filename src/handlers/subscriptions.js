const API_Reponses = require('../common/API_Responses');
const { subscribe, unsubscribe } = require('../controllers/SubscriptionsController');

const methods = {
  POST: subscribe,
  DELETE: unsubscribe,
};

exports.handler = async (event) => {
  console.log('event', event);

  const method = methods[event.httpMethod];

  if (!method) {
    return API_Reponses._405();
  }

  return method(event);
}