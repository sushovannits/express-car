export function createResponse(res, statusCode, err, message, body) {
  return res
    .status(statusCode)
    .json({
    ...err && {err},
    ...message && {message},
    ...body && {body}
  });
}

export function handleMongooseError(err) {
  let statusCode, errorMsg;
  if (err && err.name === 'ValidationError'){
    statusCode = 400;
    errorMsg = err.message;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 400;
    errorMsg = err.message; // TODO: Humanize the duplicate key error 
  }
  return {statusCode, errorMsg};
}