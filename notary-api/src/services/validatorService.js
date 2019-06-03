import axios from 'axios';
import https from 'https';
import config from '../../config';
import logger from '../utils/logger';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * @param {number} payloadID DataOrder ID in DataExchange
 * @param {object[]} payload Information to validate
 */
export const validateDataBatch = async (payloadID, payload) =>
  axios.post(`${config.notaryValidatorUrl}/validate`, {
    params: {
      nonce: payloadID,
      payload,
    },
    httpsAgent,
  });

const truthy = value => value === true || value === 'true';

/**
 * @param {object} validation Object with information regarding the validation result
 * @return {string} `verified` or `rejected`
 */
export const resultFromValidation = (validation) => {
  const {
    identified,
    error,
    error_description: errorDescription,
  } = validation;

  if (error || errorDescription) {
    logger.error(`Validation Error: ${error}::${errorDescription}`);
  }

  return truthy(identified) ? 'verified' : 'rejected';
};
