import winston from 'winston';
import config from '../../config';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: config.log.error, level: 'error' }),
    new winston.transports.File({ filename: config.log.combined }),
  ],
});

module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
