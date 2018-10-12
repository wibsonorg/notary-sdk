import 'babel-polyfill';
import app from './app';
import config from '../config';
import logger from './utils/logger';
import listenContractEvents from './contractEventSubscribers';

const server = async () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Notary API listening on port ${port} and host ${host} in ${env} mode`));

  listenContractEvents(app.locals.stores);
};

export default server;
