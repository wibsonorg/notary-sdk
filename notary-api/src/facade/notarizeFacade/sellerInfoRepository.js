import web3Utils from 'web3-utils';
import { dateOrNull } from '../helpers/date';
import { dataOrderAt } from '../../utils';

export const fetchSellerInfo = async (orderAddress, sellerAddress) => {
  const dataOrder = dataOrderAt(orderAddress);
  try {
    const sellerInfo = await dataOrder.methods
      .getSellerInfo(sellerAddress)
      .call();

    return {
      address: sellerAddress,
      notaryAddress: sellerInfo[1],
      dataHash: sellerInfo[2],
      createdAt: dateOrNull(sellerInfo[3]),
      closedAt: dateOrNull(sellerInfo[4]),
      status: web3Utils.hexToUtf8(sellerInfo[5]),
    };
  } catch (error) {
    return { error: error.message };
  }
};
