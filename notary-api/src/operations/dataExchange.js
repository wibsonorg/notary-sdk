import { logger } from '../utils';
import { dataOrders } from '../utils/stores';
import { dataOrdersQueue } from '../queues';
import { fetchDataOrders } from '../blockchain/dataOrder';

const OPEN_ORDERS = 'open_orders';

/**
 * @async
 * @function getDataOrder
 * @param {Number} orderId DataOrder id
 * @returns {Promise} DataOrder or null if not found
 */
const getDataOrder = async (orderId) => {
  const cachedDataOrder =
    await dataOrders.get(orderId) || await dataOrders.hget(OPEN_ORDERS, orderId);
  if (cachedDataOrder) {
    return JSON.parse(cachedDataOrder);
  }
  return null;
};

/**
 * @async
 * @function saveDataOrder
 * @param {Object} dataOrder DataOrder
 */
const saveDataOrder = async (orderId, dataOrder) => {
  const orderString = JSON.stringify(dataOrder);
  await dataOrders.set(orderId, orderString);
  if (dataOrder.closedAt) await dataOrders.hdel(OPEN_ORDERS, orderId);
  else await dataOrders.hset(OPEN_ORDERS, orderId, orderString);
};

/**
 * @async
 * @function getOpenOrders
 * @returns {Promise} Promise which resolves to the list of open orders.
 */
const getOpenOrders = async () =>
  (await dataOrders.hvals(OPEN_ORDERS)).map(order => JSON.parse(order));

/**
 * @async
 * @function refreshOpenOrders
 */
const refreshOpenOrders = async () => {
  const { openOrders } = await fetchDataOrders();
  // TODO: stop double fetching from blockchain
  openOrders.forEach(order =>
    dataOrdersQueue.enqueue('fetchAndSave', { orderId: order.orderId }));
};

/**
 * @async
 * @function getOrdersForSeller
 * @param {Number} sellerId Seller id
 * @returns {Promise} Resolves to list of DataOrders
 */
const getOrdersForSeller = async (sellerId) => { //eslint-disable-line
  logger.error('getOrdersForSeller NOT IMPLEMENTED');
  throw new Error('Not implemented');
};

export {
  getDataOrder,
  saveDataOrder,
  getOpenOrders,
  getOrdersForSeller,
  refreshOpenOrders,
};
