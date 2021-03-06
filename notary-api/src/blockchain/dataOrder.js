import axios from 'axios';
import { toWib } from '../utils/wibson-lib/coin';
import { DataExchange, toDate, getElements } from './contracts';

/**
 * @async
 * @function fetchDataOrder
 * @param {Number} orderId DataOrder id
 * @returns {Promise} Promise which resolves to the Data Order.
 */
export const fetchDataOrder = async (orderId) => {
  const [
    buyer,
    audience,
    price,
    requestedData,
    termsAndConditionsHash,
    buyerUrl,
    createdAt,
    closedAt,
  ] = Object.values(await DataExchange.methods.getDataOrder(orderId).call());
  const { data } = await axios.get(buyerUrl, { timeout: 5000 });
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
    ...data,
  };
};

export const fetchDataOrders = async () => {
  const openOrders = [];
  const closedOrders = [];
  const orders = await getElements(DataExchange, 'getDataOrder');
  orders.forEach((order, orderId) => {
    if (toDate(order.closedAt)) {
      closedOrders.push({ orderId, order });
    } else {
      openOrders.push({ orderId, order });
    }
  });

  return { openOrders, closedOrders };
};
