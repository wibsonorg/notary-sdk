import { contractEventListener } from './contractEventListener';
import { DataExchange, BatPay } from './contracts';
import { dataOrdersQueue } from '../queues';
import { sendUnlockJob } from '../jobs/payments';

export { contractEventListener };
contractEventListener
  .addContract(DataExchange)
  .on('DataOrderCreated', ({ orderId }) =>
    dataOrdersQueue.enqueue('fetchAndSave', { orderId: Number(orderId) }))
  .on('DataOrderClosed', ({ orderId }) =>
    dataOrdersQueue.enqueue('fetchAndSave', { orderId: Number(orderId) }))
  .addContract(BatPay)
  .on('PaymentRegistered', ({ payIndex: i }, { transactionHash: tx }) => sendUnlockJob(Number(i), tx));
