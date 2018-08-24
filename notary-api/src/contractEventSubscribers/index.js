import subscribers from './subscribers';
import { logger, dataExchange } from '../utils';

const listenBlockchainEvents = (stores) => {
  dataExchange.events.allEvents((error, result) => {
    if (!error) {
      subscribers.forEach((subscriber) => {
        if (subscriber.events.includes(result.event)) {
          logger.info(`Contract Events :: Invoking subscriber '${subscriber.name}' :: Event '${result.event}'`);
          subscriber.callback(result, stores);
          logger.info(`Contract Events :: Subscriber '${subscriber.name}' :: Event '${result.event}' :: Done `);
        } else {
          logger.info(`Contract Events :: Skipping '${subscriber.name}' :: Event '${result.event}'`);
        }
      });
    } else {
      logger.error(`Contract Events :: Error :: ${error}`);
    }
  });
};

export default listenBlockchainEvents;
