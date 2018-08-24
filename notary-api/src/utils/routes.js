import logger from './logger';

const asyncError = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

  // eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err.fileName, err.lineNumber);
  res.boom.badImplementation();
};

export { errorHandler, asyncError };
