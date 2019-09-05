import config from '../../config';
import { createQueue } from './createQueue';
import { fetchDataOrder } from '../blockchain/dataOrder';
import { saveDataOrder } from '../operations/dataExchange';

const queueName = 'DataOrdersQueue';
const { fetchOrderMaxAttempts } = config;

const defaultJobOptions =
  { priority: 3, attempts: fetchOrderMaxAttempts, backoff: { type: 'linear' } };

const dataOrdersQueue = createQueue(queueName, defaultJobOptions);

const fetchAndSaveDataOrder = async (orderId) => {
  const dataOrder = await fetchDataOrder(orderId);
  await saveDataOrder(orderId, dataOrder);
  return dataOrder;
};

dataOrdersQueue.process('fetchAndSave', async ({ data: { orderId } }) =>
  fetchAndSaveDataOrder(orderId));

export { dataOrdersQueue };
