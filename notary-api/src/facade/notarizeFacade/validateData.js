import axios from 'axios';
import uuidv4 from 'uuid/v4';
import { logger, createLevelStore } from '../../utils';
import config from '../../../config';

const dataValidationResults =
  createLevelStore(config.dataValidationResults.storePath);

/**
 * TODO: The implementation of this call is coupled to Telefonica's
 * implementation. NAPI should know nothing about Seller's data and how
 * validators work.
 *
 * @param {Object} payload Seller's data
 * @returns {String} 'in-progress': when data validator is called successfully
 *                                  and validation process started.
 *                   'failure': when data validator call failed
 */
export const validateData = async (orderAddress, sellerAddress, payload) => {
  const { msisdn } = payload;

  const nonce = uuidv4();

  try {
    await axios.get(`${config.notaryValidatorUri}/validate/${msisdn}`, {
      params: {
        nonce,
      },
    });
    const status = 'in-progress';

    await dataValidationResults.put(nonce, JSON.stringify({
      status,
      orderAddress,
      sellerAddress,
    }));

    return status;
  } catch (error) {
    if (error.response) {
      logger.error(`Data Validation failed: ${JSON.stringify(error.response.data)}`);
    } else {
      logger.error(`Data Validation error: ${error.message}`);
    }

    return 'failure';
  }
};

/**
 * @param {Object} validation Object with information regarding the validation result
 * @return {String} success|failure|na
 */
export const resultFromValidation = (validation) => {
  const {
    validated,
    identified,
    error,
    error_description: errorDescription,
  } = validation;

  let result = 'success';

  if (error) {
    logger.error(`Data Validation Resulted in error: ${error} - ${errorDescription}`);
    result = 'failure';
  } else if (!validated) {
    result = 'na';
  } else if (!identified) {
    result = 'failure';
  }

  return result;
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