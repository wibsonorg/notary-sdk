import { sellers } from '../utils/stores';

/**
 * @function saveSeller
 * take seller id and stores it with the address
 * @param {string} sellerAddress Seller's ethereum address.
 * @param {number} sellerId Seller's unique ID.
 */
export const saveSeller = async (sellerAddress, sellerId) => {
  const seller = sellers.fetch(sellerAddress);
  if (seller) {
    throw new Error('Seller has already been registered');
  }
  await sellers.store(sellerAddress, sellerId);
};
