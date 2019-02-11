import axios from 'axios';
import { dataExchange, getElements, date } from '../utils';
import { toWib } from '../utils/wibson-lib/coin';

/**
 * @async
 * @function fetchDataOrder
 * @param {Number} orderId DataOrder id
 * @returns {Promise} Promise which resolves to the Data Order.
 */
const fetchDataOrder = async (orderId) => {
  const {
    buyer,
    audience,
    price,
    requestedData,
    termsAndConditionsHash,
    buyerUrl,
    createdAt,
    closedAt,
  } = await dataExchange.methods.dataOrders(orderId).call();

  const offchainData = await axios.get(buyerUrl, { timeout: 5000 });

  return {
    orderId,
    buyer,
    audience: JSON.parse(audience),
    price: toWib(price),
    requestedData: JSON.parse(requestedData),
    termsAndConditionsHash,
    createdAt: date(createdAt),
    closedAt: date(closedAt),
    buyerUrl,
    ...offchainData,
  };
};

const fetchDataOrders = async () => {
  const openOrders = [];
  const closedOrders = [];
  const orders = await getElements(dataExchange, 'dataOrders');

  orders.forEach((order, orderId) => {
    if (date(order.closedAt)) {
      closedOrders.push({ orderId, order });
    } else {
      openOrders.push({ orderId, order });
    }
  });

  return { openOrders, closedOrders };
};

export {
  fetchDataOrder,
  fetchDataOrders,
};
