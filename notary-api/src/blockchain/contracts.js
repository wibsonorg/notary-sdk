import { web3 } from '../utils/web3';
import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';
import BatPayDefinition from '../../contracts/BatPay.json';

const { Contract } = web3.eth;
const { wibcoin, dataExchange, batPay } = config.contracts.addresses;

export const Wibcoin = new Contract(WibcoinDefinition.abi, wibcoin);
export const DataExchange = new Contract(DataExchangeDefinition.abi, dataExchange);
export const BatPay = new Contract(BatPayDefinition.abi, batPay);

export const toDate = ts => (ts > 0 ? new Date(ts * 1000).toISOString() : null);

/**
 * @function getElements
 * @param {Object} contract the instance of the truffle contract to consult.
 * @param {String} property The property name to get the list from.
 * @returns {Array} An array of elements stored in the property.
 */
export const getElements = async (contract, property, start = 0) => {
  if (!contract) throw new Error('Contract must exist');
  const elements = [];
  const getElement = i => contract.methods[property](i).call();
  try {
    let e = await getElement(0);
    for (let i = start; e && e !== '0x'; i += 1) {
      /* eslint-disable no-await-in-loop */
      elements.push(e);
      e = await getElement(i);
    }
  } catch (_) { /**/ }
  return elements;
};
