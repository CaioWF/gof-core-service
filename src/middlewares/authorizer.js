const moment = require('moment');

const API_Responses = require('../common/API_Responses');
const JWT = require('../utils/JWT');

const allowedPaths = [
  { path: '/auth', method: 'POST' },
  { path: '/users', method: 'POST' }
];

const pathPermissions = [
  { path: '/users', method: '*', validProfiles: ['STUDENT', 'TEACHER'] },
  { path: '/users/{id}', method: '*', validProfiles: ['STUDENT', 'TEACHER'] },
  { path: '/courses', method: 'GET', validProfiles: ['STUDENT', 'TEACHER'] },
  { path: '/courses', method: 'POST', validProfiles: ['TEACHER'] },
  { path: '/courses/{id}', method: 'GET', validProfiles: ['STUDENT', 'TEACHER'] },
  { path: '/courses/{id}', method: 'PUT', validProfiles: ['TEACHER'] },
  { path: '/courses/{id}', method: 'DELETE', validProfiles: ['TEACHER'] },
  { path: '/classes', method: 'GET', validProfiles: ['STUDENT', 'TEACHER'] },
  { path: '/classes', method: 'POST', validProfiles: ['TEACHER'] },
  { path: '/classes/{id}', method: 'GET', validProfiles: ['STUDENT', 'TEACHER'] },
  { path: '/classes/{id}', method: 'PUT', validProfiles: ['TEACHER'] },
  { path: '/classes/{id}', method: 'DELETE', validProfiles: ['TEACHER'] },
  { path: '/connections', method: '*', validProfiles: ['STUDENT', 'TEACHER'] },
];

const isAnAllowedPath = (event) => {
  const matchedPaths = allowedPaths.filter((el) => el.path === event.path && el.method === event.httpMethod);

  return !!matchedPaths.length;
};

const havePermission = (event, profile) => {
  const matchedPermissions = pathPermissions.filter((el) => el.path === event.path && (el.method === '*' || el.method === event.httpMethod) && el.validProfiles.includes(profile));

  return !!matchedPermissions.length;
};

const sanitizeToken = (token) => token.replace(/Bearer /, '');

const tokenIsExpired = (tokenTime) => {
  const startTime = moment.unix(tokenTime);
  const endTime = moment(moment.now());
  const difference = moment.duration(endTime.diff(startTime)).asMinutes();

  return difference > 30;
}

const authorize = async (event, context) => {
  if (isAnAllowedPath(event)) return;

  try {
    const token = event.headers.Authorization;

    if (!token) throw {
      message: 'Token not found'
    };

    const sanitizedToken = sanitizeToken(token);

    const { username, profile, iat } = JWT.decrypt(sanitizedToken);

    if (!username || !profile || !iat) throw {
      message: 'Invalid token'
    };

    if (tokenIsExpired(iat)) throw {
      message: 'Token has expired'
    }

    if (!havePermission(event, profile)) throw {
      message: 'Unauthorized'
    };
  } catch (error) {
    context.end();

    return API_Responses._401({ message: error.message });
  }
};

module.exports = { authorize };