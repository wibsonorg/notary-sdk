import config from '../../../config';
import { createLevelStore } from '../../utils';

const notarizationResultsStore =
  createLevelStore(config.notarizationResults.storePath);

export const fetchNotarizationResult = async (orderAddress, sellerAddress) => {
  try {
    const payload = await notarizationResultsStore
      .get(`${orderAddress}/${sellerAddress}`);
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
};

export const storeNotarizationResult = async (orderAddress, sellerAddress, payload) =>
  notarizationResultsStore
    .put(`${orderAddress}/${sellerAddress}`, JSON.stringify(payload));
