import { dataOrdersQueue } from '../queues';

const fetchAndSave = async (res) => {
  const { orderId } = res.returnValues;
  dataOrdersQueue.enqueue('fetchAndSave', { orderId });
};

const DataOrderCreated = fetchAndSave;
const DataOrderClosed = fetchAndSave;

export default {
  DataOrderCreated,
  DataOrderClosed,
};
