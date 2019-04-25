import axios from 'axios';
import { brokerUrl, batPayId } from '../../config';
import { jobify } from '../utils/jobify';
import { fetchTxData, fetchTxLogs } from '../blockchain/contracts';
import { packPayData } from '../blockchain/batPay';
import { getDataOrder } from '../operations/dataExchange';
import { notarizationResults } from '../utils/stores';

/**
 * BatPay.registerPayment handler: TODO: addUnlockJob
 * @param {number} payIndex Payment index on BatPay
 * @param {string} transferHash Transfer transaction hash
 */
export async function sendUnlock(payIndex, transferHash) {
  const validateOrThrow = (condition, error) => {
    if (!condition) {
      // if executed as a job, discard when transfer is not valid
      if (this && this.discard) this.discard();
      throw new Error(`Validation Error: ${error}`);
    }
  };
  const transfer = await fetchTxData(transferHash);
  const notarization = await notarizationResults.safeFetch(transfer.lock);
  validateOrThrow(notarization, 'notarization not found');
  const {
    masterKey, request,
    result: { notarizationFee, notarizationPercentage },
  } = notarization;
  validateOrThrow(
    transfer.payData === packPayData(request.sellers),
    'payData did not match sellerIds',
  );
  const { orderId } = await fetchTxLogs(transfer.metadata);
  validateOrThrow(
    orderId === request.orderId,
    'metadata did not match order',
  );
  const { price } = await getDataOrder(orderId);
  validateOrThrow(
    transfer.amount === price,
    'amount did not match price',
  );
  const fee = (price * request.sellers.length * (notarizationPercentage / 100))
            + notarizationFee;
  validateOrThrow(
    transfer.fee === fee,
    'fee did not match requested fee',
  );
  await axios.post(`${brokerUrl}/unlock`, {
    payIndex,
    unlockerId: batPayId,
    key: masterKey,
  }, { timeout: 5000 });
}
export const sendUnlockJob = jobify(sendUnlock);
