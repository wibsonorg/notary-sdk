import {
  fetchNotarizationResult,
  storeNotarizationResult,
} from './notarizationResultRepository';
import { getSellerInfo, getSellerData } from './seller';
import { validateData } from './validateData';
import { logger } from '../../utils';
import signingService from '../../services/signingService';
import config from '../../../config';

const randomInt = (low, high) =>
  Math.floor((Math.random() * (high - low)) + low);

const notarizeDataFromSeller = async (orderAddress, sellerAddress) => {
  const {
    notaryAddress,
    closedAt,
  } = await getSellerInfo(orderAddress, sellerAddress);
  const { address } = await signingService.getAccount();

  return notaryAddress === address && !closedAt;
};

/**
 * Notarization operation
 *
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whos data is being audited
 * @returns {Object} object with notarization result or with an error
 */
export const notarize = async (orderAddress, sellerAddress) => {
  if (!await notarizeDataFromSeller(orderAddress, sellerAddress)) {
    const error = `Can't notarize data from seller '${sellerAddress}' in order '${orderAddress}'`;
    logger.info(error);
    return { error };
  }

  const payload = { result: 'na' };

  if (randomInt(1, 100) <= config.responsesPercentage) {
    const sellerData = await getSellerData(sellerAddress);
    payload.result = await validateData(sellerData);
  }

  await storeNotarizationResult(orderAddress, sellerAddress, payload);

  return payload;
};

/**
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whos data is being audited
 * @throws
 * @returns
 */
export const fetchNotarizationResultOrNotarize = async (
  orderAddress,
  sellerAddress,
) => {
  let response = await fetchNotarizationResult(orderAddress, sellerAddress);

  if (!response) {
    response = await notarize(orderAddress, sellerAddress);
    await storeNotarizationResult(orderAddress, sellerAddress, response);
  }

  return response;
};
