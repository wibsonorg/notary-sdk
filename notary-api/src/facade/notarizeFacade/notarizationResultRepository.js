import { notarizationResults } from '../../utils/stores';

export const fetchNotarizationResult = async (
  orderAddress,
  sellerAddress,
  defaultResult = { result: 'na' },
) => {
  try {
    const payload = await notarizationResults.get(`${orderAddress}/${sellerAddress}`);
    return JSON.parse(payload);
  } catch (err) {
    return defaultResult;
  }
};

export const storeNotarizationResult = async (orderAddress, sellerAddress, payload) =>
  notarizationResults.put(`${orderAddress}/${sellerAddress}`, JSON.stringify(payload));
