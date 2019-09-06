import { sellersByPayIndex } from '../utils/stores';
import { BatPay } from '../blockchain/contracts';
import { packMessage } from '../utils/wibson-lib/cryptography';
import { decryptData } from '../services/signingService';

const ZERO_ACCOUNT = '0x0000000000000000000000000000000000000000';

const ERROR_INCOMPLETE_REGISTRATION = {
  message: 'The registration for this id is still incomplete',
  code: 'incompleteRegistration',
};

const ERROR_INVALID_BATPAY_ID = {
  message: 'Try with a valid id',
  code: 'invalidId',
};

const ERROR_INVALID_SIGNATURE = {
  message: 'The signature is invalid or don\'t correspond to this batPayId',
  code: 'invalidSignature',
};

/**
 * @async
 * @function getAddressesByBatPayId
 * @param {Object} [params] data payload needed in the operation.
 * @param {number} [params.batPayId] ID in BatPay.
 * @param {number} [params.payIndex] Payment index in BatPay.
 * @param {string} [params.signature] The signed of the owner of the BatPay ID.
 * @returns {Array} An array of the addresses.
 */
export const getAddressesByBatPayId = async ({ payIndex, batPayId, signature }) => {
  try {
    const { owner } = await BatPay.methods.accounts(batPayId).call();
    if (owner === ZERO_ACCOUNT) {
      return { error: ERROR_INCOMPLETE_REGISTRATION };
    }
    try {
      const decrypted = await decryptData({ senderAddress: owner, encryptedData: signature });
      if (decrypted !== packMessage(batPayId, payIndex)) {
        return { error: ERROR_INVALID_SIGNATURE };
      }
    } catch (_e) {
      return { error: ERROR_INVALID_SIGNATURE };
    }
  } catch (e) {
    return { error: ERROR_INVALID_BATPAY_ID };
  }
  const sellers = await sellersByPayIndex.safeFetch(payIndex, {});
  return sellers[batPayId] || { completed: [], rejected: [] };
};
