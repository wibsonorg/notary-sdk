import axios from 'axios';
import https from 'https';
import config from '../../config';
import logger from '../utils/logger';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * @param {number} dataGroupId The unique identifier for the validation data group
 * @param {string} dataBatchId The unique identifier for the validation batch
 * @param {object[]} payload Information to validate
 */
export const validateDataBatch = async (dataGroupId, dataBatchId, payload) =>
  axios.post(
    `${config.notaryValidatorUrl}/validate`,
    { dataGroupId, dataBatchId, payload },
    { httpsAgent },
  );

const truthy = value => value === true || value === 'true';

/**
 * @param {object} validation Object with information regarding the validation result
 * @return {'ignored'|'verified'|'rejected'} Validation result
 */
export const getResultFromValidation = (validation) => {
  if (!validation) return 'ignored';
  const { identified, error, error_description: errorDescription } = validation;
  if (error || errorDescription) {
    logger.error(`Validation Error: ${error}::${errorDescription}`);
  }
  return truthy(identified) ? 'verified' : 'rejected';
};
