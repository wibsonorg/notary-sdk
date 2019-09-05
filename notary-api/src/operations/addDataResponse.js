import { dataResponses } from '../utils/stores';

/**
 * @async
 * @function addDataResponse
 * @param {Object} dataOrder DataOrder object
 * @param {Number} dataResponse.orderId Order ID in the DataExchange contract
 * @param {String} dataResponse.sellerAddress Seller's Ethereum address
 * @param {Number} dataResponse.sellerId Seller's ID in the BatPay contract
 * @param {String} dataResponse.encryptedData Data encrypted with symmetric-key algorithm
 * @param {String} dataResponse.decryptionKey Key used to encrypt the data
 * @returns {Object} Object with either the id and status of the DataResponse
 *                   or the error if any.
 */
export const addDataResponse = async (dataResponse) => {
  try {
    const {
      orderId,
      sellerAddress,
    } = dataResponse;
    const id = `${orderId}:${sellerAddress}`;

    const existingDataResponse = await dataResponses.safeFetch(id);

    if (existingDataResponse) return existingDataResponse;

    // TODO: upload data to S3
    await dataResponses.store(id, dataResponse);

    return { id, status: 'accepted' };
  } catch (error) {
    return { error };
  }
};
