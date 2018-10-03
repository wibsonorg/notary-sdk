import web3 from './web3';
import config from '../../config';

import WibcoinDefinition from '../../contracts/Wibcoin.json';
import DataOrderDefinition from '../../contracts/DataOrder.json';
import DataExchangeDefinition from '../../contracts/DataExchange.json';

/**
 * @param {String} addr ethereum address
 * @returns {web3.eth.Contract} instan of the contract
 */
const wibcoinAt = addr =>
  new web3.eth.Contract(WibcoinDefinition.abi, addr);

/**
 * @param {String} addr ethereum address
 * @returns {web3.eth.Contract} instan of the contract
 */
const dataOrderAt = addr =>
  new web3.eth.Contract(DataOrderDefinition.abi, addr);

/**
 * @param {String} addr ethereum address
 * @returns {web3.eth.Contract} instan of the contract
 */
const dataExchangeAt = addr =>
  new web3.eth.Contract(DataExchangeDefinition.abi, addr);

const {
  wibcoin: wibcoinAddr,
  dataExchange: dataExchangeAddr,
} = config.contracts.addresses;

const wibcoin = wibcoinAt(wibcoinAddr);
const dataExchange = dataExchangeAt(dataExchangeAddr);

export {
  wibcoin,
  wibcoinAt,
  dataOrderAt,
  dataExchange,
  dataExchangeAt,
};
