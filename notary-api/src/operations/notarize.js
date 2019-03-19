import uuidv4 from 'uuid/v4';
import config from '../../config';
import { addNotarizationJob } from '../queues/notarizationsQueue';
import { notarizationResults } from '../utils/stores';
import { packMessage, sha3 } from '../utils/wibson-lib/cryptography/hashing';
import { packPayData } from '../blockchain/batPay';

const createNotarization = async ({
  orderId,
  sellers,
  callbackUrl,
  notarizationPercentage = 0,
  notarizationFee = 0,
}) => {
  const masterKey = uuidv4();
  const lock = packMessage(config.batPayId, masterKey);
  await notarizationResults.store(lock, {
    masterKey,
    status: 'accepted',
    payDataHash: sha3(packPayData(sellers)), // TODO: this should not be necessary
    request: {
      orderId,
      callbackUrl,
    },
    result: {
      sellers,
      orderId,
      notarizationPercentage,
      notarizationFee,
    },
  });
  return lock;
};

/**
 * @function notarize
 * @param {Object} params
 * @param {String} params.orderId Order ID that buyer uses for identifying the order
 * @param {String} params.callbackUrl Buyer's URL to call after notarizing data
 * @param {String} params.notarizationPercentage OPTIONAL: Percentage of data to notarize
 * @param {String} params.notarizationFee OPTIONAL: Amount of WIB that notary will receive
 * @param {Object[]} params.sellers Array of sellers to notarize
 * @param {Number} params.sellers.sellerAddress Seller's ethereum address
 * @param {Number} params.sellers.sellerId Seller's Batpay's address
 * @param {Number} params.sellers.decryptionKeyHash Hash of seller's decryption key
 */
export const notarize = async (params) => {
  try {
    const lock = await createNotarization(params);
    addNotarizationJob(lock);
    return true;
  } catch (Error) {
    return false;
  }
};
