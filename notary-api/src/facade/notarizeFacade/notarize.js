import {
  fetchNotarizationResult,
  storeNotarizationResult,
} from './notarizationResultRepository';
import { fetchSellerInfo } from './sellerInfoRepository';
import { validateData, resultFromValidation } from './validateData';
import { logger } from '../../utils';
import { storage } from '../../utils/wibson-lib';
import { getAccount, decryptData } from '../../services/signingService';
import config from '../../../config';

const randomInt = (low, high) =>
  Math.floor((Math.random() * (high - low)) + low);

const canNotarizeDataFromSeller = async (orderAddress, sellerAddress) => {
  const {
    notaryAddress,
    closedAt,
  } = await fetchSellerInfo(orderAddress, sellerAddress);
  const { address } = await getAccount();

  return notaryAddress === address && !closedAt;
};

const getData = async (orderAddress, sellerAddress) => {
  const encryptedData = await storage.getData(
    orderAddress,
    sellerAddress,
  );
  const decryptedMessage = await decryptData({
    encryptedData,
    senderAddress: sellerAddress,
  });
  return JSON.parse(decryptedMessage);
};

/**
 * Notarization operation
 *
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whose data is being audited
 * @param {Boolean} randomize whether to check percentage or not
 * @returns {Object} object with notarization result or with an error
 */
export const notarize = async (orderAddress, sellerAddress, randomize = true) => {
  const canNotarize = await canNotarizeDataFromSeller(orderAddress, sellerAddress);
  if (!canNotarize) {
    const error = `Can't or should not notarize data from seller '${sellerAddress}' in order '${orderAddress}'`;
    logger.error(error);
    return { error };
  }

  const payload = { result: 'na' };

  if (!randomize || randomInt(1, 100) <= config.responsesPercentage) {
    const sellerData = config.takeDataFromStorage && await getData(orderAddress, sellerAddress);
    payload.result = await validateData(orderAddress, sellerAddress, sellerData);
  }

  await storeNotarizationResult(orderAddress, sellerAddress, payload);

  return payload;
};

/**
 * Forces notarization operation
 *
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whose data was audited
 * @param {Object} validation Object with information regarding the validation result
 * @returns {Object} object with notarization result or with an error
 */
export const updateNotarizationResultFromValidation = async (
  orderAddress,
  sellerAddress,
  validation,
) => {
  let notarizationResult = await fetchNotarizationResult(orderAddress, sellerAddress);
  notarizationResult = { ...notarizationResult, result: resultFromValidation(validation) };
  await storeNotarizationResult(orderAddress, sellerAddress, notarizationResult);
};

/**
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whose data is being audited
 * @returns {Object} object with notarization result or with an error
 */
export const notarizeOnDemand = async (orderAddress, sellerAddress) => {
  let response = await fetchNotarizationResult(orderAddress, sellerAddress);

  if (!response || response.result === 'na') {
    response = await notarize(orderAddress, sellerAddress, false);
  }
  return response;
};
