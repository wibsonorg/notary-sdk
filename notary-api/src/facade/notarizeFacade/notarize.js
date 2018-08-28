import {
  fetchNotarizationResult,
  storeNotarizationResult,
} from './notarizationResultRepository';
import { fetchSellerInfo } from './sellerInfoRepository';
import { validateData } from './validateData';
import { logger } from '../../utils';
import { storage } from '../../utils/wibson-lib';
import signingService from '../../services/signingService';
import config from '../../../config';

// const randomInt = (low, high) =>
//   Math.floor((Math.random() * (high - low)) + low);

const randomInt = (low, high) => 1;

const notarizeDataFromSeller = async (orderAddress, sellerAddress) => {
  const {
    notaryAddress,
    closedAt,
  } = await fetchSellerInfo(orderAddress, sellerAddress);
  const { address } = await signingService.getAccount();

  return notaryAddress === address && !closedAt;
};

/**
 * Notarization operation
 *
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whos data is being audited
 * @param {Boolean} randomize whether to check percentage or not
 * @returns {Object} object with notarization result or with an error
 */
export const notarize = async (orderAddress, sellerAddress, randomize = true) => {
  if (!await notarizeDataFromSeller(orderAddress, sellerAddress)) {
    const error = `Can't notarize data from seller '${sellerAddress}' in order '${orderAddress}'`;
    logger.info(error);
    return { error };
  }

  const payload = { result: 'na' };

  if (!randomize || randomInt(1, 100) <= config.responsesPercentage) {
    const sellerData = await storage.getData(
      { address: orderAddress },
      sellerAddress,
    );
    payload.result = await validateData(sellerData);
  }

  await storeNotarizationResult(orderAddress, sellerAddress, payload);

  return payload;
};

/**
 * Forces notarization operation
 *
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whos data is being audited
 */
export const notarizeOnDemand = async (orderAddress, sellerAddress) => {
  let response = await fetchNotarizationResult({ orderAddress, sellerAddress });
  if (!response || !response.wasAudited) {
    response = await notarize(orderAddress, sellerAddress, false);
    await storeNotarizationResult({ orderAddress, sellerAddress, ...response });
  }

  return response;
};
