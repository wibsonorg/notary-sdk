/* eslint-disable strict */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

// TODO: Consider moving config folder to src, since tests must not use it.
// Do NOT use dotenv here. Let the loadEnv function in src/loadEnv handle that.
const { env } = process;

const config = {
  app: {
    name: env.npm_package_name,
    version: env.npm_package_version,
    repositoryUrl: env.npm_package_repository_url.replace(/(\.git|git\+)/g, ''),
  },
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  bodySizeLimit: env.BODY_SIZE_LIMIT,
  batPayId: Number(env.BATPAY_ID),
  notaryName: env.NOTARY_NAME,
  notaryPublicBaseUrl: env.NOTARY_PUBLIC_BASE_URL,
  notarySigningServiceUrl: env.NOTARY_SIGNING_SERVICE_URL,
  notaryValidatorUrl: env.NOTARY_VALIDATOR_URL,
  requestTimeout: env.REQUEST_TIMEOUT,
  brokerUrl: env.BROKER_URL,
  contracts: {
    addresses: {
      wibcoin: env.WIBCOIN_ADDRESS,
      dataExchange: env.DATA_EXCHANGE_ADDRESS,
      batPay: env.BATPAY_ADDRESS,
    },
  },
  responsesPercentage: Number(env.RESPONSES_PERCENTAGE),
  notarizationFeePercentage: env.NOTARIZATION_FEE_PERCENTAGE,
  notarizationTermsOfService: env.NOTARIZATION_TERMS_OF_SERVICE,
  notarizeJobMaxAttempts: Number(env.NOTARIZE_JOB_MAX_ATTEMPTS),
  fetchOrderMaxAttempts: Number(env.FETCH_ORDER_MAX_ATTEMPTS),
  takeDataFromStorage: env.TAKE_DATA_FROM_STORAGE === 'true',
  cache: {
    enabled: env.CACHE === 'enabled',
    adapter: env.CACHE_ADAPTER,
  },
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG,
    slack: env.SLACK_LOG,
  },
  web3: {
    provider: env.WEB3_PROVIDER,
  },
  redis: {
    url: env.REDIS_URL,
    prefix: env.REDIS_PREFIX,
    jobs: { concurrency: env.REDIS_JOBS_CONCURRENCY },
  },
  contractEventListener: {
    interval: Number(env.CONTRACT_EVENT_LISTENER_INTERVAL),
    lastProcessedBlock: Number(env.CONTRACT_EVENT_LISTENER_LAST_PROCESSED_BLOCK),
  },
  levelDirectory: env.LEVEL_DIRECTORY,
  storage: {
    bucket: env.STORAGE_BUCKET,
    region: env.STORAGE_REGION,
    user: env.STORAGE_USER,
    password: env.STORAGE_PASSWORD,
  },
};

exports.default = config;
