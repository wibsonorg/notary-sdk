import axios from 'axios';
import uuidv4 from 'uuid/v4';
import config from '../../../config';
import { logger } from '../../utils';
import { dataValidationResults } from '../../utils/stores';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * @param {Object} payload Seller's data
 */
export const validateData = async (orderAddress, sellerAddress, payload) => {
  try {
    const nonce = uuidv4();
    await dataValidationResults.put(nonce, JSON.stringify({
      orderAddress,
      sellerAddress,
    }));

    await axios.post(
      `${config.notaryValidatorUri}/validate`,
      { nonce, payload, payloadID: orderAddress },
      { httpsAgent },
    );
  } catch (error) {
    if (error.response) {
      logger.error(`Data Validation failed: ${JSON.stringify(error.response.data)}`);
    } else {
      logger.error(`Data Validation error: ${error.message}`);
    }
  }
};

/**
 * @param {Object} validation Object with information regarding the validation result
 * @return {String} success|failure|na
 */
export const resultFromValidation = (validation) => {
  const {
    validated, // eslint-disable-line no-unused-vars
    identified,
    error,
    error_description: errorDescription,
  } = validation;
  if (error || errorDescription) {
    logger.error(`Validation Error: ${error}::${errorDescription}`);
  }
  return identified === true || identified === 'true' ? 'success' : 'failure';
};

/**
 * @async
 * @param {String} nonce Unique universal identifier (v4)
 * @returns {Object} identified by `nonce` or null if not found
 */
export const fetchAndRemoveValidationResult = async (nonce) => {
  try {
    const raw = await dataValidationResults.get(nonce);
    await dataValidationResults.del(nonce);
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};
