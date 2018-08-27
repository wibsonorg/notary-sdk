import axios from 'axios';
import { logger } from '../../utils';
import config from '../../../config';

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
export const validateData = async (payload) => {
  console.log('[validateData]', payload);
  const { msisdn } = payload;
  if (!msisdn) return 'failure';

  try {
    await axios.get(`${config.notaryValidatorUri}/validate/${msisdn}`);

    return 'in-progress';
  } catch (error) {
    if (error.response) {
      logger.error(`Data Validation failed: ${JSON.stringify(error.response.data)}`);
    } else {
      logger.error(`Data Validation error: ${error.message}`);
    }

    return 'failure';
  }
};
