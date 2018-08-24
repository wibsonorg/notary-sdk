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
  timeout: env.TIMEOUT,
  orderAddress: env.ORDER_ADDRESS,
  contracts: {
    addresses: {
      dataExchange: env.DATA_EXCHANGE_ADDRESS,
    },
  },
  responsesPercentage: env.RESPONSES_PERCENTAGE,
  notarizationFee: env.NOTARIZATION_FEE,
  notarizationTermsOfService: env.NOTARIZATION_TERMS_OF_SERVICE,
  signature: env.SIGNATURE,
  cache: {
    enabled: env.CACHE === 'enabled',
    adapter: env.CACHE_ADAPTER,
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
  notarizationResults: {
    storePath: env.NOTARIZATION_RESULTS_STORE_PATH,
  },
  levelDirectory: env.LEVEL_DIRECTORY,
};

exports.default = config;
