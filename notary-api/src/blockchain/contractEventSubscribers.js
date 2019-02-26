import { contractEventListener } from './contractEventListener';
import { DataExchange, BatPay } from './contracts';
import { dataOrdersQueue } from '../queues';
import { sendUnlockJob } from '../jobs/payments';

export { contractEventListener };
contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', ({ orderId }) => dataOrdersQueue.enqueue('notifyNew', { orderId }))
  .on('DataOrderClosed', ({ orderId }) => dataOrdersQueue.enqueue('fetchAndSave', { orderId }))
  .addContract(BatPay)
  .on('Transfer', ({ payIndex: i }, { transactionHash: tx }) => sendUnlockJob(i, tx));
