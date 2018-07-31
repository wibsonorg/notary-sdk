import 'babel-polyfill';
import app from './app';
import config from '../config';
import logger from './utils/logger';

const { port, env } = config;

app.listen(port, () =>
  logger.info(`Notary Signing Service listening on port ${port} in ${env} mode`));
