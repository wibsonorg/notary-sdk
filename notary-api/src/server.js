import 'babel-polyfill';
import app from './app';
import config from '../config';
import logger from './utils/logger';
import listenContractEvents from './contractEventSubscribers';

const server = async () => {
  const { port, env } = config;
  app.listen(port, () =>
    logger.info(`Notary API listening on port ${port} in ${env} mode`));

  listenContractEvents(app.locals.stores);
};

export default server;
