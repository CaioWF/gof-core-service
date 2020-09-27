const API_Reponses = require('../common/API_Responses');
const { show, store, update, destroy } = require('../controllers/ClassesController');

const methods = {
  GET: show,
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