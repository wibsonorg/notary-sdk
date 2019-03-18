import axios from 'axios';
import config from '../../config';

const https = require('https');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const client = axios.create({
  baseURL: `${config.notarySigningServiceUri}/`,
  timeout: 1000,
  httpsAgent,
});

const getHealth = async () => {
  const { data } = await client.get('/health');
  return data;
};

export const getAccount = async () => {
  const { data } = await client.get('/account');
  return data;
};

const signNotarization = async (payload) => {
  const { data } = await client.post(
    '/buyers/audit/result',
    payload,
  );

  return data;
};

const decryptData = async (payload) => {
  const { data } = await client.post(
    '/data/decrypt',
    payload,
  );

  return data.message;
};

const signinService = {
  getHealth,
  getAccount,
  signNotarization,
  decryptData,
};

export default signinService;
