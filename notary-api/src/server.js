import '@babel/polyfill';
import app from './app';
import config from '../config';
import logger from './utils/logger';
import { contractEventListener } from './blockchain/contractEventSubscribers';
import { refreshOpenOrders } from './operations/dataExchange';

const checkConfig = (conf) => {
  let error = false;

  const traverse = (o, p) => {
    Object.entries(o).forEach((entry) => {
      const [k, v] = entry;
      const keyName = p ? `${p}.${k}` : k;

      if (v === undefined) {
        error = true;
        logger.error(`Environment variable ['${k}' '${v}'] -> '${keyName}' is not defined`);
      } else if (typeof v === 'object') {
        traverse(v, keyName);
      }
    });
  };

  traverse(conf);
  if (error) {
    logger.error('Configuration check failed. Exiting');
    process.exit(1);
  }
};

const server = () => {
  checkConfig(config);
  const { port, host, env } = config;

  app.listen({ port, host }, () =>
    logger.info(`Wibson API listening on port ${port} and host ${host} in ${env} mode`));

  refreshOpenOrders();

  contractEventListener.listen();
};

export default server;
