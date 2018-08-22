import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger } from './utils';

const { port, host, env } = config;
app.listen({ port, host }, () =>
  logger.info('Notary Validator API listening on port ' +
  `${port} and host ${host} in ${env} mode`));