import axios from 'axios';
import config from '../../config';
import { jobify } from '../utils/jobify';
import { fetchTxData, fetchTxLogs } from '../blockchain/contracts';
import { packPayData } from '../blockchain/batPay';
import { getDataOrder } from '../operations/dataExchange';
import { notarizationResults, sellersByPayIndex } from '../utils/stores';
import { fromWib } from '../utils/wibson-lib/coin';

import { getResultsByBatPayId } from './paymentsHelpers';

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
    result: {
      notarizationFee, notarizationPercentage, sellers: paidSellers, rejectedSellers,
    },
  } = notarization;

  validateOrThrow(
    registerPayment.payData === packPayData(paidSellers.map(({ id }) => id)),
    'payData did not match sellerIds',
  );
  const { orderId } = await fetchTxLogs(registerPayment.metadata);
  validateOrThrow(Number(orderId) === request.orderId, 'metadata did not match order');
  const { price } = await getDataOrder(orderId);
  validateOrThrow(registerPayment.amount === fromWib(price), 'amount did not match price');
  const fee = (price * (paidSellers.length * (notarizationPercentage / 100))) + notarizationFee;
  validateOrThrow(Number(registerPayment.fee) === fee, 'fee did not match requested fee');

  const addressesByBatPayId = getResultsByBatPayId(paidSellers, rejectedSellers);
  await sellersByPayIndex.store(payIndex, addressesByBatPayId);

  await axios.post(
    `${brokerUrl}/unlock`,
    {
      payIndex,
      unlockerAccountId: batPayId,
      key: masterKey,
    },
    { timeout: 5000 },
  );
}
export const sendUnlockJob = jobify(sendUnlock);
