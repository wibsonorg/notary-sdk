import { notarizationResults } from '../../utils/stores';

export const fetchNotarizationResult = async (
  orderAddress,
  sellerAddress,
  defaultResult = { error: 'Unknown notarization' },
) => {
  try {
    const key = `${orderAddress.toLowerCase()}/${sellerAddress.toLowerCase()}`;
    const payload = await notarizationResults.get(key);
    return JSON.parse(payload);
  } catch (err) {
    return defaultResult;
  }
};

export const storeNotarizationResult = async (orderAddress, sellerAddress, payload) => {
  const key = `${orderAddress.toLowerCase()}/${sellerAddress.toLowerCase()}`;
  return notarizationResults.put(key, JSON.stringify(payload));
};
