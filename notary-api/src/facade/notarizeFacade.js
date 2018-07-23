import axios from 'axios';
import config from '../../config';
import { createLevelStore } from '../utils';

const notarizationResultsStore =
  createLevelStore(config.notarizationResults.storePath);

const fetchNotarizationResult = async ({ orderAddress, sellerAddress }) => {
  try {
    const payload = await notarizationResultsStore
      .get(`${orderAddress}/${sellerAddress}`);
    return JSON.parse(payload);
  } catch (err) {
    return null;
  }
};

const storeNotarizationResult = async ({
  orderAddress,
  sellerAddress,
  ...payload
}) => notarizationResultsStore
  .put(`${orderAddress}/${sellerAddress}`, JSON.stringify(payload));

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
  let response = await fetchNotarizationResult({ orderAddress, sellerAddress });

  if (!response) {
    response = await notarize(orderAddress, sellerAddress);
    await storeNotarizationResult({ orderAddress, sellerAddress, ...response });
  }

  return response;
};

export default fetchNotarizationResultOrNotarize;
