import { dataExchange, logger } from '../utils';
import { eventBlocks } from '../utils/stores';
import dataExchangeEvents from './dataExchange';

const contracts = [dataExchange];
const subscribers = dataExchangeEvents;

const getStartingBlock = async () => {
  try {
    const lp = await eventBlocks.get('last_processed_block');
    logger.debug(`getStartingBlock ${lp}`);
    if (lp === Number.POSITIVE_INFINITY) {
      return 0;
    }
    return Number(lp) + 1;
  } catch (err) {
    logger.debug(`getStartingBlock nothing found, returning ZERO. Because: ${err}`);
    return 0;
  }
};

const getEvents = async () => {
  const fromBlock = await getStartingBlock();
  logger.debug(`Contract Events :: From block :: ${fromBlock}`);

  return (await Promise.all(contracts.map(c => c.getPastEvents('allEvents', { fromBlock }))))
    .reduce((acc, val) => acc.concat(val), []) // Flatten events from all contracts
    .filter(result => Number(result.blockNumber) > 0); // Confirmed events
};

const saveLastProcessedBlock = async (events) => {
  const blockNumbers = events.map(result => result.blockNumber);
  const lastProcessedBlock = Math.max(...blockNumbers);
  await eventBlocks.put('last_processed_block', lastProcessedBlock);
  logger.info(`Contract Events :: Last processed block :: ${lastProcessedBlock}`);
};

const processEvents = async () => {
  const events = await getEvents();

  events.forEach((e) => {
    const subscriber = subscribers[e.event];
    if (subscriber) {
      logger.info(`Contract Events :: Processing Event :: '${e.event}'`);
      subscriber(e);
    }
  });

  await saveLastProcessedBlock(events);
};

export default { processEvents };
