const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Uuid = require('../utils/uuid');

const tableName = 'connections-table';

const show = async () => {
  const [connection] = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  return API_Responses._200(connection);
};

const increment = async ({ body }) => {
  const [connection] = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  if (!connection) {
    const id = Uuid.generate();
    const newConnection = await Dynamo.write({ id, numberOfConnections: 1 }, tableName);
    return API_Responses._201(newConnection);
  }

  const updatedConnection = await Dynamo.write({ id: connection.id, numberOfConnections: connection.numberOfConnections + 1 }, tableName);

  return API_Responses._201(updatedConnection);
};

module.exports = { show, increment };