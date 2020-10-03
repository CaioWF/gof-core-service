const moment = require('moment');
const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Uuid = require('../utils/uuid');

const tableName = 'connections-table';

const numberOfConnections = async () => {
  const connections = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  return API_Responses._200({ numberOfConnections: connections.length });
};

const connectionsPerDayOfWeek = async () => {
  const startOfWeek = moment().startOf('week').toDate();
  const endOfWeek = moment().endOf('week').toDate();

  const connections = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  const connectionsInThisWeek = connections.filter(el => moment(el.date).isBetween(startOfWeek, endOfWeek));

  const connectionsPerDay = connectionsInThisWeek.reduce((acc, cur) => {
    let connectionDay = moment(cur.date).day();
    acc[connectionDay] += 1;
    return acc;
  }, { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0})


  return API_Responses._200(connectionsPerDay);
}

const store = async ({ body }) => {
  const id = Uuid.generate();
  const date = moment().toDate().toISOString();

  const newConnection = await Dynamo.write({ id, date }, tableName);

  return API_Responses._201(newConnection);
};

module.exports = { numberOfConnections, connectionsPerDayOfWeek, store };