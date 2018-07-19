import axios from 'axios';
import config from '../../config';

const fetchNotarizationResult = (orderAddress, sellerAddress) => null;
const storeNotarizationResult = params => null;
const randomInt = (low, high) =>
  Math.floor((Math.random() * (high - low)) + low);

/**
 * Notarize THIS operation
 *
 * @param {String} orderAddress Order address
 * @param {String} sellerAddress Seller address whos data is being audited
 * @returns
 */
const notarize = async (orderAddress, sellerAddress) => {
  let result = 'na';

  if (randomInt(1, 100) <= config.responsesPercentage) {
    result = 'success';
  }

  // eslint-disable-next-line no-await-in-loop
  const { data: { signature } } = await axios.post(
    `${config.notarySigningServiceUri}/buyers/audit/result`,
    {
      orderAddress,
      sellerAddress,
      wasAudited: result === 'success',
      // Data Validators will be implemented in further releases
      isDataValid: result === 'success',
    },
  );

  return { signature, result };
};

const fetchNotarizationResultOrNotarize = async (
  orderAddress,
  sellerAddress,
) => {
  let response = await fetchNotarizationResult(orderAddress, sellerAddress);

  if (!response) {
    response = await notarize(orderAddress, sellerAddress);
    await storeNotarizationResult(response);
  }

  return response;
};

export default fetchNotarizationResultOrNotarize;
