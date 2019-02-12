import Web3 from 'web3';
import config from '../../config';

const web3 = new Web3(config.web3.provider);

// TODO: avoid using default exports
export default web3;
