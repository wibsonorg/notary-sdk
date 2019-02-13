import { dateOrNull } from '../helpers/date';

const { web3, dataOrderAt } = {}; // from '../../utils';
// TODO: to be updated [v2]

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
      status: web3.utils.hexToUtf8(sellerInfo[5]),
    };
  } catch (error) {
    return { error: error.message };
  }
};
