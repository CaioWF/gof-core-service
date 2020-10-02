const API_Reponses = require('../common/API_Responses');
const { index, show, store, update, destroy, rank } = require('../controllers/CoursesController');

const mapGetMethod = (event) => {
  if (event.pathParameters) {
    if (event.pathParameters.id) return show(event);
    if (event.pathParameters.top) return rank(event);
  } else return index(event);
}

const methods = {
  GET: mapGetMethod,
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