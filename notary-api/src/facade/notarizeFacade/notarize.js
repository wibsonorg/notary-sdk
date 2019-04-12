import {
  fetchNotarizationResult,
  storeNotarizationResult,
} from './notarizationResultRepository';
import { fetchSellerInfo } from './sellerInfoRepository';
import { validateData, resultFromValidation } from './validateData';
import { logger } from '../../utils';
import { storage } from '../../utils/wibson-lib';
import signingService from '../../services/signingService';
import config from '../../../config';

const randomInt = (low, high) =>
  Math.floor((Math.random() * (high - low)) + low);

const canNotarizeDataFromSeller = async (orderAddress, sellerAddress) => {
  const {
    notaryAddress,
    closedAt,
  } = await fetchSellerInfo(orderAddress, sellerAddress);
  const { address } = await signingService.getAccount();

  return notaryAddress === address && !closedAt;
};

const getData = async (orderAddress, sellerAddress) => {
  const encryptedData = await storage.getData(
    orderAddress,
    sellerAddress,
  );
  const decryptedMessage = await signingService.decryptData({
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
 * @param {Boolean} freeRide If true, data response is not required to be on-chain
 * @returns {Object} object with notarization result or with an error
 */
export const notarize = async (orderAddress, sellerAddress, randomize = true, freeRide) => {
  const canNotarize = freeRide || await canNotarizeDataFromSeller(orderAddress, sellerAddress);
  if (!canNotarize) {
    const error = `Can't or should not notarize data from seller '${sellerAddress}' in order '${orderAddress}'`;
    logger.error(error);
    return { error };
  }

  const oldResponse = await fetchNotarizationResult(orderAddress, sellerAddress);

  if (oldResponse.unknown || oldResponse.result === 'na') {
    const willValidate = (!randomize || randomInt(1, 100) <= config.responsesPercentage);

    const payload = {
      result: willValidate ? 'in-progress' : 'na',
    };
    await storeNotarizationResult(orderAddress, sellerAddress, payload);

    if (willValidate) {
      const sellerData = config.takeDataFromStorage && await getData(orderAddress, sellerAddress);
      validateData(orderAddress, sellerAddress, sellerData);
    }
    return payload;
  }

  return oldResponse;
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
  const notarizationResult = { result: resultFromValidation(validation) };
  await storeNotarizationResult(orderAddress, sellerAddress, notarizationResult);
};
