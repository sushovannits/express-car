import Lamlog from 'lamlog';
export function createLogger(level) {
  const resolvedLevel = level ||
    (process.env.NODE_ENV === 'dev' ?
      'debug' :
      'error');
  const logger = new Lamlog({
    name: 'app',
    level: resolvedLevel
  });
  return logger;
}

export function createResponse(res, statusCode, errorMsg, message, body) {
  return res
    .status(statusCode)
    .json({
      ...errorMsg && {
        errorMsg
      },
      ...message && {
        message
      },
      ...body && {
        body
      },
    });
}

export function handleMongooseError(err) {
  let statusCode;
  let errorMsg;
  if (err && err.name === 'ValidationError') {
    statusCode = 400;
    errorMsg = err.message;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 400;
    errorMsg = err.message; // TODO: Humanize the duplicate key error
  }
  return {
    statusCode,
    errorMsg
  };
}