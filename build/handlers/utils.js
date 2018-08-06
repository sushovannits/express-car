'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.createResponse = createResponse;
exports.handleMongooseError = handleMongooseError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createResponse(res, statusCode, errorMsg, message, body) {
  return res.status(statusCode).json((0, _extends3.default)({}, errorMsg && { errorMsg: errorMsg }, message && { message: message }, body && { body: body }));
}

function handleMongooseError(err) {
  var statusCode = void 0,
      errorMsg = void 0;
  if (err && err.name === 'ValidationError') {
    statusCode = 400;
    errorMsg = err.message;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 400;
    errorMsg = err.message; // TODO: Humanize the duplicate key error 
  }
  return { statusCode: statusCode, errorMsg: errorMsg };
}
//# sourceMappingURL=utils.js.map