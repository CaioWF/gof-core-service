const _ = require('lodash');
const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const subscribe = async ({ body }) => {
  const { courseId, studentUsername } = JSON.parse(body);

  const course = await Dynamo.get({ id: courseId }, 'courses-table').catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const student = await Dynamo.get({ username: studentUsername }, 'users-table').catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!student) {
    return API_Responses._404({ message: 'User not found' });
  }
  
  course.students.push(_.omit(student, ['courses']));

  await Dynamo.write(course, 'courses-table');

  student.courses.push(_.omit(course, ['classes', 'students']));

  await Dynamo.write(student, 'users-table');

  return API_Responses._200();
};

const unsubscribe = async ({ body }) => {
  const { courseId, studentUsername } = JSON.parse(body);

  const course = await Dynamo.get({ id: courseId }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const student = await Dynamo.get({ username: studentUsername }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);

    return null;
  });

  if (!student) {
    return API_Responses._404({ message: 'User not found' });
  }

  course.students = course.students.filter(el => el.username !== studentUsername);

  await Dynamo.write(course, 'courses-table');

  student.courses = student.courses.filter(el => el.id !== courseId);

  await Dynamo.write(student, 'users-table');

  return API_Responses._200();
};

module.exports = { subscribe, unsubscribe };