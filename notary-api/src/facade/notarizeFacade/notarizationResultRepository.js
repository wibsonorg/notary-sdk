import config from '../../../config';
import { createLevelStore } from '../../utils';

const notarizationResultsStore = createLevelStore(config.notarizationResults.storePath);

export const fetchNotarizationResult = async (
  orderAddress,
  sellerAddress,
  defaultResult = { result: 'na' },
) => {
  try {
    const payload = await notarizationResultsStore.get(`${orderAddress}/${sellerAddress}`);
    return JSON.parse(payload);
  } catch (err) {
    return defaultResult;
  }
};

export const storeNotarizationResult = async (orderAddress, sellerAddress, payload) =>
  notarizationResultsStore.put(`${orderAddress}/${sellerAddress}`, JSON.stringify(payload));
