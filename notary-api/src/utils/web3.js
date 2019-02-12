import Web3 from 'web3';
import config from '../../config';

export const web3 = new Web3(config.web3.provider);
