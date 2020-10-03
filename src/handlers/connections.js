const API_Reponses = require('../common/API_Responses');
const { numberOfConnections, connectionsPerDayOfWeek, store } = require('../controllers/ConnectionsController');

const methods = {
  GET: (event) => event.path === '/connections/total' ? numberOfConnections(event) : connectionsPerDayOfWeek(event),
  POST: store,
};

exports.handler = async (event) => {
  console.log('event', event);

  const method = methods[event.httpMethod];

  if (!method) {
    return API_Reponses._405();
  }

  return method(event);
}