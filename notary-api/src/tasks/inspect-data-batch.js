import web3 from 'web3';

import { prepareDataBatchForValidation } from '../queues/notarizationsQueue';
import logger from '../utils/logger';

export default async () => {
  const orderId = 0; // DX Order ID
  const sellerAddresses = []; // array of seller addresses

  const sellersToValidate = sellerAddresses.map(address => ({ address }));
  const dataBatch = await prepareDataBatchForValidation(orderId, sellersToValidate);

  const packages = dataBatch.reduce((acc, seller) => {
    const hash = web3.utils.keccak256(Buffer.from(JSON.stringify(seller.data)));
    const sellers = acc[hash] || [];
    sellers.push(seller);
    acc[hash] = sellers;
    return acc;
  }, {});

  const duplicated = Object.values(packages)
    .filter(sellers => sellers.length > 1)
    .map(sellers => ({
      addresses: sellers.map(seller => seller.id),
      data: sellers[0].data,
    }));

  logger.info(JSON.stringify(duplicated));
};
