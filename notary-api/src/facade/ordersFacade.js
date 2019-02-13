import { BigNumber } from 'bignumber.js';

const { dataOrderAt } = {}; // from '../utils';
// TODO: to be updated [v2]

const getNotarizationFee = async (orderAddress, notarizationPercentage) => {
  const dataOrder = dataOrderAt(orderAddress);
  const price = await dataOrder.methods.price().call();
  const bnPrice = new BigNumber(price);
  return bnPrice.multipliedBy(notarizationPercentage).dividedBy(100);
};

export { getNotarizationFee };
