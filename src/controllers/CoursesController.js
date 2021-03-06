const API_Responses = require("../common/API_Responses");
const Dynamo = require("../common/Dynamo");
const Uuid = require("../utils/uuid");

const tableName = "courses-table";

const index = async ({ queryStringParameters }) => {
  const { teacherUsername } = queryStringParameters
    ? queryStringParameters
    : {};
  const courses = await Dynamo.scan(tableName).catch((err) => {
    console.log("error in Dynamo Scan", err);

    return [];
  });

  return API_Responses._200(
    teacherUsername
      ? courses.filter((el) => el.teacher.username === teacherUsername)
      : courses
  );
};

const show = async ({ pathParameters }) => {
  const { id } = pathParameters;

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log("error in Dynamo Get", err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: "Course not found" });
  }

  return API_Responses._200(course);
};

const store = async ({ body }) => {
  const {
    name,
    teacher,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
  } = JSON.parse(body);
  const id = Uuid.generate();

  const newCourse = await Dynamo.write(
    {
      id,
      name,
      teacher,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      students: [],
      classes: [],
    },
    tableName
  );

  return API_Responses._201(newCourse);
};

const update = async ({ body, pathParameters }) => {
  const { id } = pathParameters;
  const {
    name,
    teacher,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    classes
  } = JSON.parse(body);

  const course = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log("error in Dynamo Get", err);

    return null;
  });

  if (!course) {
    return API_Responses._404({ message: "Course not found" });
  }

  const updatedCourse = await Dynamo.write(
    {
      id,
      name,
      teacher,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      classes
    },
    tableName
  );

  return API_Responses._200(updatedCourse);
};

const destroy = async ({ pathParameters }) => {
  const { id } = pathParameters;

  const user = await Dynamo.get({ id }, tableName).catch((err) => {
    console.log("error in Dynamo Get", err);

    return null;
  });

  if (!user) {
    return API_Responses._404({ message: "Course not found" });
  }

  await Dynamo.delete({ id }, tableName);

  return API_Responses._204();
};

const rank = async ({ pathParameters }) => {
  const { top } = pathParameters;

  const courses = await Dynamo.scan(tableName).catch((err) => {
    console.log('error in Dynamo Scan', err);
    return [];
  });

  courses.sort((a, b) => b.students.length - a.students.length);

  courses.splice(top);

  return API_Responses._200(courses);
}

module.exports = { index, show, store, update, destroy, rank };
