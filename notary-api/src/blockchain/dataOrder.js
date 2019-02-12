import axios from 'axios';
import { toWib } from '../utils/wibson-lib/coin';
import { DataExchange, toDate, getElements } from './contracts';
import { contractEventListener } from './contractEventListener';
import { dataOrdersQueue } from '../queues';

contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', async ({ orderId }) => {
    dataOrdersQueue.enqueue('notifyNew', { orderId });
  }).on('DataOrderClosed', async ({ orderId }) => {
    dataOrdersQueue.enqueue('fetchAndSave', { orderId });
  });

/**
 * @async
 * @function fetchDataOrder
 * @param {Number} orderId DataOrder id
 * @returns {Promise} Promise which resolves to the Data Order.
 */
export const fetchDataOrder = async (orderId) => {
  const {
    buyer,
    audience,
    price,
    requestedData,
    termsAndConditionsHash,
    buyerUrl,
    createdAt,
    closedAt,
  } = await DataExchange.methods.dataOrders(orderId).call();

  const offchainData = await axios.get(buyerUrl, { timeout: 5000 });

  return {
    orderId,
    buyer,
    audience: JSON.parse(audience),
    price: toWib(price),
    requestedData: JSON.parse(requestedData),
    termsAndConditionsHash,
    createdAt: toDate(createdAt),
    closedAt: toDate(closedAt),
    buyerUrl,
    ...offchainData,
  };
};

export const fetchDataOrders = async () => {
  const openOrders = [];
  const closedOrders = [];
  const orders = await getElements(DataExchange, 'dataOrders');

  orders.forEach((order, orderId) => {
    if (toDate(order.closedAt)) {
      closedOrders.push({ orderId, order });
    } else {
      openOrders.push({ orderId, order });
    }
  });

  return { openOrders, closedOrders };
};
