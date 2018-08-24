import axios from 'axios';
import config from '../../config';

const client = axios.create({
  baseURL: `${config.notarySigningServiceUri}/`,
  timeout: 1000,
});

const getHealth = async () => {
  const { data } = await client.get('/health');
  return data;
};

const getAccount = async () => {
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

const signinService = {
  getHealth,
  getAccount,
  signNotarization,
};

export default signinService;
