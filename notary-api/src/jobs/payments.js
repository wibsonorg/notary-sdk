import { jobify } from '../utils/jobify';
// import { fetchTxData } from '../blockchain/contracts';
// import { unpackPayData } from '../blockchain/batpay';

/**
 * BatPay.Transfer handler: TODO: addUnlockJob
 * @param {number} payIndex Payment index on BatPay
 * @param {string} transferHash Transfer transaction hash
 */
export async function sendUnlock(payIndex, transferHash) {
  throw new Error(`Not implemented fun(${payIndex}, ${transferHash})`);
}
export const sendUnlockJob = jobify(sendUnlock);
