import { BigNumber } from 'bignumber.js';
import { dataOrderAt } from '../utils';

const getNotarizationFee = async (orderAddress, notarizationPercentage) => {
  const dataOrder = dataOrderAt(orderAddress);
  const price = await dataOrder.price();
  const bnPrice = new BigNumber(price);
  return bnPrice.multipliedBy(notarizationPercentage).dividedBy(100);
};

export { getNotarizationFee };
