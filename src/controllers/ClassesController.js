const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Uuid = require('../utils/uuid');
const SignedUrl = require('../utils/SignedUrl');

const tableName = 'courses-table';

const show = async ({ pathParameters }) => {
  const { id, classId } = pathParameters;

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);
    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  if (!course.classes) {
    return API_Responses._404({ message: 'Class not found' });
  }
  
  const [classFound] = course.classes.filter((item) => item.id === classId);

  if (!classFound) {
    return API_Responses._404({ message: 'Class not found' });
  }

  const signedUrl = await SignedUrl.generate('getObject', classFound.video);

  return API_Responses._200({ class: classFound, url: signedUrl });
};

const store = async (event) => {
  const { id } = event.pathParameters;
  const { title } = JSON.parse(event.body);

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);
    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const fileName = `${Uuid.generate()}.mp4`;
  const signedUrl = await SignedUrl.generate('putObject', fileName);
  
  const classId = Uuid.generate();

  const newClass = { id: classId, title, video: fileName };

  course.classes.push(newClass);

  await Dynamo.write(course, tableName);

  return API_Responses._201({class: newClass, url: signedUrl});
};

const update = async (event) => {
  const { id, classId } = event.pathParameters;
  const { title } = event.body;

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);
    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const [classPassed] = course.classes.filter((item) => item.id === classId);

  if (!classPassed) {
    return API_Responses._404({ message: 'Class not found' });
  }

  const fileName = `${Uuid.generate()}.mp4`;
  const signedUrl = await SignedUrl.generate('putObject', fileName);

  const updatedClass = {
    id: classId,
    title,
    video: fileName,
  };

  const updatedClasses = course.classes.map((item) => {
    if (item.id === classId) {
      return updatedClass;
    }
    return item;
  });

  course.classes = updatedClasses;

  await Dynamo.write(course, tableName);

  return API_Responses._200({ class: updatedClass, url: signedUrl });
};

const destroy = async ({ pathParameters }) => {
  const { id, classId  } = pathParameters;

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);
    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  const [classPassed] = course.classes.filter((item) => item.id === classId);

  if (!classPassed) {
    return API_Responses._404({ message: 'Class not found' });
  }

  const updatedClasses = course.classes.map((item) => item.id !== classId);

  course.classes = updatedClasses;

  await Dynamo.write(course, tableName);

  return API_Responses._204();
};

module.exports = { show, store, update, destroy };