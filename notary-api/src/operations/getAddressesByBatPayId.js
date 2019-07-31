import { sellersByPayIndex } from '../utils/stores';
import { BatPay } from '../blockchain/contracts';
import { decryptSignedMessage, hashMessage, packMessage } from '../utils/wibson-lib/cryptography';

const ERROR_REGISTRATION_INCOMPLETED = {
  message: 'The registration for this id is not completed still',
  code: 'registrationImcompleted',
};

const ERROR_INVALID_BATPAY_ID = {
  message: 'Try with a valid id',
  code: 'invalidId',
};

const ERROR_INVALID_SIGNATURE = {
  message: 'The signature is invalid or don\'t correspond to this batPayId',
  code: 'invalidSignature',
};

const checkSignature = async (
  batPayAddress, {
    publicKey, signature, payIndex, batPayId,
  }) => {
  let decryptMessage;
  const message = hashMessage(packMessage(batPayId, payIndex));
  try {
    decryptMessage = await decryptSignedMessage(batPayAddress, publicKey, signature);
  } catch (_e) {
    return false;
  }
  return (decryptMessage === message);
};

/**
 * @async
 * @function getAddressesByBatPayId
 * @param {Object} [params] data payload needed in the operation.
 * @param {number} [params.batPayId] ID in BatPay.
 * @param {number} [params.payIndex] Payment index in BatPay.
 * @param {string} [params.signature] The signed of the owner of the BatPay ID.
 * @param {string} [params.publicKey] The publicKey of the owner of the BatPay ID.
 * @returns {Array} An array of the addresses.
 */
export const getAddressesByBatPayId = async (params) => {
  const { payIndex, batPayId } = params;
  try {
    const [batPayAddress] = Object.values(await BatPay.methods.accounts(batPayId).call());
    if (batPayAddress && (/^0x0+$/.test(batPayAddress))) return { error: ERROR_REGISTRATION_INCOMPLETED };
    if (!(await checkSignature(batPayAddress, params))) return { error: ERROR_INVALID_SIGNATURE };
  } catch (e) {
    return { error: ERROR_INVALID_BATPAY_ID };
  }
  const addresses = (await sellersByPayIndex.safeFetch(payIndex, {}))[batPayId];
  return { addresses };
};
