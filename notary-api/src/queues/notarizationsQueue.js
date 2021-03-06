import config from '../../config';
import { createQueue } from './createQueue';
import { notarizationResults, dataResponses } from '../utils/stores';
import { validateDataBatch } from '../services/validatorService';
import { completeNotarizationJob } from '../operations/completeNotarization';
import { decryptWithPrivateKey } from '../utils/wibson-lib/cryptography';
import logger from '../utils/logger';

const queueName = 'NotarizationQueue';
const defaultJobOptions = {
  priority: 3,
  attempts: config.notarizeJobMaxAttempts,
  backoff: { type: 'linear' },
};
const notarizationQueue = createQueue(queueName, defaultJobOptions);

/**
 * @function fetchData Fetches and decrypts seller's data
 * @param {number} orderId
 * @param {object} seller
 */
const fetchData = async (orderId, seller) => {
  const { address } = seller;

  // TODO: fetch data from S3
  const { encryptedData, decryptionKey } = await dataResponses.fetch(`${orderId}:${address}`);
  const decryptedData = decryptWithPrivateKey(decryptionKey, encryptedData);
  return JSON.parse(decryptedData);
};

/**
 * @function prepareDataBatchForValidation
 * @param {number} orderId
 * @param {object[]} sellers
 */
export const prepareDataBatchForValidation = (orderId, sellers) =>
  Promise.all(sellers.map(async seller => ({
    id: seller.address,
    data: await fetchData(orderId, seller),
  })));

const randomInt = (low, high) => Math.floor((Math.random() * (high - low)) + low);
const inAgreement = () => randomInt(1, 100) <= config.responsesPercentage;

export const notarize = async (lockingKeyHash) => {
  const notarization = await notarizationResults.safeFetch(lockingKeyHash);
  if (!notarization) return false;
  const { request: { orderId }, result: { sellers } } = notarization;
  const sellersToValidate = sellers.filter(inAgreement);
  if (sellersToValidate.length > 0) {
    const dataBatch = await prepareDataBatchForValidation(orderId, sellersToValidate);
    await validateDataBatch(orderId, lockingKeyHash, dataBatch);
    await notarizationResults.update(lockingKeyHash, { status: 'validating' });
  } else {
    completeNotarizationJob(lockingKeyHash);
  }
  return true;
};

notarizationQueue.process('notarize', ({ data }) => notarize(data));
notarizationQueue.on('failed', ({
  id, name, failedReason, data, attemptsMade,
}) => {
  logger.crit('NotarizationQueue :: Could not notarize\n' +
    `Error on '${name}' processor: ${failedReason}\n` +
    `Job ID: ${id} | Attemps made: ${attemptsMade}\n` +
    `Data: ${JSON.stringify(data)}`);
});

export const addNotarizationJob = lockingKeyHash =>
  notarizationQueue.add('notarize', lockingKeyHash);
