import R from 'ramda';

/**
 * @typedef {string} BatPayID
 * @typedef {string} Address
 *
 * @typedef Seller The pair of the seller's BatPayID and Address used.
 * @property {BatPayID} id BatPayID used to receive the payment.
 * @property {Address} address Address owned by the seller.
 *
 * @typedef ValidationResult A group of validated sellers, both completed and rejected by the notary
 * @property {Array<Address>} completed All sellers that completed the notarization successfully
 * @property {Array<Address>} rejected All sellers that failed the notarization done by the notary
 */

/**
 * @function reformat Groups an array of Sellers by BatPayID, leaving only the Addresses
 * @param {Array<Seller>} sellers Sellers to be grouped by BatPayID.
 * @returns {Object<BatPayID, Array<Address>>} Addresses grouped by BatPayID.
 * */
const reformat = R.pipe(
  R.groupBy(R.prop('id')),
  R.map(R.pluck('address')),
);

/**
 * @function mergeByBatPayId Merges two groups of sellers, creating a ValidationResult.
 * @param {BatPayID} id
 * @param {Array<Seller>} completed All sellers that completed the notarization successfully
 * @param {Array<Seller>} rejected All sellers that failed the notarization done by the notary
 * @returns {ValidationResult} A group of validated sellers.
 * */
const mergeByBatPayId = (id, completed, rejected) => ({ completed, rejected });

/**
 * @function getResultsByBatPayId Reorganizes the results between all completed and
 *                                rejected sellers grouping by BatPayID
 * @param {Array<Seller>} completedSellers All sellers that completed
 * the notarization successfully
 * @param {Array<Seller>} rejectedSellers All sellers that failed
 * the notarization done by the notary.
 * @returns {Object<BatPayID, ValidationResult>} All validated sellers grouped by BatPayID
 * */
export const getResultsByBatPayId = (completedSellers, rejectedSellers) => {
  const completed = reformat(completedSellers || []);
  const rejected = reformat(rejectedSellers || []);

  return R.mergeWithKey(mergeByBatPayId, completed, rejected);
};
