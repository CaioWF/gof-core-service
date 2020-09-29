const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Uuid = require('../utils/uuid');

const tableName = 'courses-table';

const index = async ({ queryParams }) => {
  const { byProfessorId } = queryParams;
  const courses = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);

    return [];
  });

  return API_Responses._200(
    byProfessorId ?
      courses.filter(el => el.teacher.id === byProfessorId) :
      courses
  );
};

const show = async ({ pathParameters }) => {
  const { id } = pathParameters;

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  return API_Responses._200(course);
};

const store = async ({ body }) => {
  const { name, description, teacher, students } = JSON.parse(body);
  const id = Uuid.generate();

  const newCourse = await Dynamo.write({ id, name, description, teacher, students, classes: [] }, tableName);

  return API_Responses._201(newCourse);
};

const update = async ({ body, pathParameters }) => {
  const { id } = pathParameters;
  const { name, description, teacher, classes, students } = JSON.parse(body);

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const updatedCourse = await Dynamo.write({ id, name, description, teacher, students, classes }, tableName);

  return API_Responses._200(updatedCourse);
};

const destroy = async ({ pathParameters }) => {
  const { id } = pathParameters;

  const user = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: 'Course not found' });
  }

  await Dynamo.delete({ id }, tableName);

  return API_Responses._204();
};

module.exports = { index, show, store, update, destroy };