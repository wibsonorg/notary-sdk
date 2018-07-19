/* eslint-disable */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var _process = process,
    env = _process.env;

var config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  // TEST
  privateKey: env.PRIVATE_KEY,
  orderAddress: env.ORDER_ADDRESS,
  responsesPercentage: env.RESPONSES_PERCENTAGE,
  notarizationFee: env.NOTARIZATION_FEE,
  notarizationTermsOfService: env.NOTARIZATION_TERMS_OF_SERVIE,
  signature: env.SIGNATURE,

  cache: {
    enabled: env.CACHE === 'enabled',
    adapter: env.CACHE_ADAPTER
  },
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG
  },
  web3: {
    provider: env.WEB3_PROVIDER
  },
  redis: {
    socket: env.REDIS_SOCKET
  },
};

exports.default = config;
