import axios from 'axios';
import config from '../../config';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const client = axios.create({
  baseURL: `${config.notarySigningServiceUrl}/`,
  timeout: config.requestTimeout,
  httpsAgent,
});

const get = async (path) => {
  const { data } = await client.get(path);
  return data;
};

const post = async (path, payload) => {
  const { data } = await client.post(path, payload);
  return data;
};

const getHealth = () => get('/health');
const getAccount = () => get('/account');

const signNotarization = payload => post('/buyers/audit/result', payload);
const signNotaryInfo = payload => post('/account/info', payload);

const decryptData = async (payload) => {
  const { message } = await post('/data/decrypt', payload);
  return message;
};

const signinService = {
  getHealth,
  getAccount,
  signNotarization,
  signNotaryInfo,
  decryptData,
};

export default signinService;
