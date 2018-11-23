import 'babel-polyfill';
import app from './app';
import config from '../config';
import { logger, attachContractEventSubscribers } from './utils';
import contractEventSubscribers from './contractEventSubscribers';

function runInterval(fn, delay) {
  fn();
  return setInterval(fn, delay);
}

const server = async () => {
  const { port, host, env } = config;
  app.listen({ port, host }, () =>
    logger.info(`Notary API listening on port ${port} and host ${host} in ${env} mode`));

  runInterval(
    () => attachContractEventSubscribers(
      contractEventSubscribers,
      app.locals.stores,
      config.eventSubscribers.lastProcessedBlock,
    ),
    Number(config.eventSubscribers.interval),
  );
};

export default server;
