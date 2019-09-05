import Web3 from 'web3';
import config from '../../config';

export const web3 = new Web3(config.web3.provider);

/**
 * It returns the bytes type of a string
 * @param  {string} value string to be converted
 * @return {string}       hex-bytes converted value
 */
export const castToBytes = value => web3.utils.asciiToHex(value);
