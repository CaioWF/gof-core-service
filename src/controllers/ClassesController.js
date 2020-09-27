const API_Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const Uuid = require('../utils/uuid');
const UploadFile = require('../utils/uploadFile');
const {parseForm} = require('../utils/formDataParser');

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

  return API_Responses._200(classFound);
};

const store = async (event) => {
  const { id } = event.pathParameters;

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log('error in Dynamo Get', err);
    return null;
  });

  if (!course) {
    return API_Responses._404({ message: 'Course not found' });
  }

  await parseForm(event);
  const { body } = event;

  let fileName = null;
  if (body.file) fileName = await UploadFile.exec(body.file, body.fileName);
  
  const classId = Uuid.generate();

  const newClass = { id: classId, title: body.title, description: body.description, video: fileName };

  course.classes.push(newClass);

  await Dynamo.write(course, tableName);

  return API_Responses._201(newClass);
};

const update = async (event) => {
  const { id, classId } = event.pathParameters;

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

  await parseForm(event);
  const { body } = event;

  let fileName = null;
  if (body.file) fileName = await UploadFile.exec(body.file, body.fileName);

  const updatedClass = {
    id: classId,
    title: body.title,
    description: body.description,
    video: fileName !== null ? fileName : classPassed.video,
  };

  const updatedClasses = course.classes.map((item) => {
    if (item.id === classId) {
      return updatedClass;
    }
    return item;
  });

  course.classes = updatedClasses;

  await Dynamo.write(course, tableName);

  return API_Responses._200(updatedClass);
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