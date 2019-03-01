import uuidv4 from 'uuid/v4';
import { addNotarizationJob } from '../queues/notarizationsQueue';
import { notarizationResults } from '../utils/stores';
import { packMessage, sha3 } from '../utils/wibson-lib/cryptography/hashing';
import { packPayData } from '../blockchain/batPay';
import { getAccount } from '../services/signingService';

const createNotarization = async ({
  orderId,
  sellers,
  callbackUrl,
  notarizationPercentage = 0,
  notarizationFee = 0,
}) => {
  const masterKey = uuidv4();
  const payData = packPayData(sellers.map(s => s.sellerId));
  const payDataHash = sha3(payData);
  const { batPayId } = await getAccount();
  const lock = packMessage(batPayId, masterKey);
  const notarization = {
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
    payDataHash,
    masterKey,
    status: 'accepted',
  };

  await notarizationResults.store(lock, notarization);

  return lock;
};

/**
 * @function notarize
 * @param {String} params.orderId Order ID that buyer uses for identifying the order
 * @param {Number} params.sellers Array of sellers to notarize
 * @param {Number} params.sellers.sellerAddress Seller's ethereum address
 * @param {Number} params.sellers.sellerId Seller's Batpay's address
 * @param {Number} params.sellers.decryptionKeyHash Hash of seller's decryption key
 * @param {String} params.callbackUrl Buyer's URL to call after notarizing data
 * @param {String} params.notarizationPercentage OPTIONAL: Percentage of data to notarize
 * @param {String} params.notarizationFee OPTIONAL: Amount of WIB that notary will receive
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
