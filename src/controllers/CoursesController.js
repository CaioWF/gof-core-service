const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Encrypter = require('../utils/Encrypter');

const tableName = 'courses-table';

const index = async () => {
  const courses = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  return API_Responses._200(courses);
};

const show = async ({ pathParameters }) => {
  const { id } = pathParameters;

  const course = await Dynamo.get({ ID: id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  return API_Responses._200(course);
};

const store = async ({ body }) => {
  const { name, description, teacher } = JSON.parse(body);

  const newCourse = await Dynamo.write({ name, description, teacher }, tableName);

  return API_Responses._201(newCourse);
};

const update = async ({ body, pathParameters }) => {
  const { id } = pathParameters;
  const { name, description, teacher } = JSON.parse(body);

  const course = await Dynamo.get({ ID: id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const updatedCourse = await Dynamo.write({ ID: id, name, description, teacher }, tableName);

  return API_Responses._200(updatedCourse);
};

const destroy = async ({ pathParameters }) => {
  const { id  } = pathParameters;

  const user = await Dynamo.get({ ID: id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: 'Course not found' });
  }

  await Dynamo.delete({ ID: id }, tableName);

  return API_Responses._204();
};

module.exports = { index, show, store, update, destroy };