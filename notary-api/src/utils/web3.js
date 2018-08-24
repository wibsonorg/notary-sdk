import Web3 from 'web3';
import WebsocketProvider from 'web3-providers-ws';
import config from '../../config';

const web3 = new Web3(new WebsocketProvider(config.web3.provider));

export default web3;
