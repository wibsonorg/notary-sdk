import axios from 'axios';
import config from '../../config';
import { jobify } from '../utils/jobify';
import { fetchTxData, fetchTxLogs } from '../blockchain/contracts';
import { packPayData } from '../blockchain/batPay';
import { getDataOrder } from '../operations/dataExchange';
import { notarizationResults } from '../utils/stores';

const { brokerUrl, batPayId } = config;

/**
 * BatPay.registerPayment handler: TODO: addUnlockJob
 * @param {number} payIndex Payment index on BatPay
 * @param {string} registerPaymentHash registerPayment transaction hash
 */
export async function sendUnlock(payIndex, registerPaymentHash) {
  const validateOrThrow = (condition, error) => {
    if (!condition) {
      // if executed as a job, discard when registerPayment is not valid
      if (this && this.discard) this.discard();
      throw new Error(`Validation Error: ${error}`);
    }
  };
  const registerPayment = await fetchTxData(registerPaymentHash);
  const notarization = await notarizationResults.safeFetch(registerPayment.lockingKeyHash);
  validateOrThrow(notarization, 'notarization not found');
  const {
    masterKey,
    request,
    result: { notarizationFee, notarizationPercentage, sellers },
  } = notarization;
  validateOrThrow(
    registerPayment.payData === packPayData(sellers),
    'payData did not match sellerIds',
  );
  const { orderId } = await fetchTxLogs(registerPayment.metadata);
  validateOrThrow(Number(orderId) === request.orderId, 'metadata did not match order');
  const { price } = await getDataOrder(orderId);
  validateOrThrow(registerPayment.amount === '10000', 'amount did not match price');
  // eslint-disable-next-line no-mixed-operators
  const fee = price * request.sellers.length * (notarizationPercentage / 100) + notarizationFee;
  validateOrThrow(Number(registerPayment.fee) === fee, 'fee did not match requested fee');
  await axios.post(
    `${brokerUrl}/unlock`,
    {
      payIndex,
      unlockerId: batPayId,
      key: masterKey,
    },
    { timeout: 5000 },
  );
}
export const sendUnlockJob = jobify(sendUnlock);
