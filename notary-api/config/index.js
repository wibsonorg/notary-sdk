/* eslint-disable strict */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

// TODO: Consider moving config folder to src, since tests must not use it.
// Do NOT use dotenv here. Let the loadEnv function in src/loadEnv handle that.
const { env } = process;

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  notarySigningServiceUri: env.NOTARY_SIGNING_SERVICE_URI,
  notaryValidatorUri: env.NOTARY_VALIDATOR_URI,
  contracts: {
    addresses: {
      dataExchange: env.DATA_EXCHANGE_ADDRESS,
    },
  },
  responsesPercentage: env.RESPONSES_PERCENTAGE,
  notarizationFeePercentage: env.NOTARIZATION_FEE_PERCENTAGE,
  notarizationTermsOfService: env.NOTARIZATION_TERMS_OF_SERVICE,
  takeDataFromStorage: env.TAKE_DATA_FROM_STORAGE === 'true',
  cache: {
    enabled: env.CACHE === 'enabled',
    adapter: env.CACHE_ADAPTER,
    ordersTTL: Number(env.CONTRACTS_CACHE_ORDERS_TTL),
  },
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG,
  },
  web3: {
    provider: env.WEB3_PROVIDER,
  },
  redis: {
    socket: env.REDIS_SOCKET,
  },
  contractEventListener: {
    interval: Number(env.CONTRACT_EVENT_LISTENER_INTERVAL),
    lastProcessedBlock: Number(env.CONTRACT_EVENT_LISTENER_LAST_PROCESSED_BLOCK),
  },
  levelDirectory: env.LEVEL_DIRECTORY,
  storage: {
    url: env.STORAGE_URL,
    region: env.STORAGE_REGION,
    user: env.STORAGE_USER,
    password: env.STORAGE_PASSWORD,
    bucket: env.STORAGE_BUCKET,
  },
};

exports.default = config;
