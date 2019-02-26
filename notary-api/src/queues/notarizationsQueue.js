import axios from 'axios';
import config from '../../config';
import { createQueue } from './createQueue';
import { getAccount } from '../services/signingService';
import { notarizationResults } from '../utils/stores';

const queueName = 'NotarizationQueue';
const { fetchOrderMaxAttempts } = config;

const defaultJobOptions =
  { priority: 3, attempts: fetchOrderMaxAttempts, backoff: { type: 'linear' } };

const notarizationQueue = createQueue(queueName, defaultJobOptions);

export const notarize = async ({
  lock,
}) => {
  const notarization = notarizationResults.safeFetch(lock);
  if (!notarization) return;

  const { address: notaryAddress } = await getAccount();

  const {
    request: {
      orderId,
      callbackUrl,
    },
    result: {
      notarizationPercentage,
      notarizationFee,
    },
    payDataHash,
  } = notarization;

  notarization.result.sellers.forEach((seller, i) => {
    this[i].result = 'ignored';
    this[i].decryptionKeyEncryptedWithMasterKey = '';
  }, notarization.result.sellers);

  const notarizationResponse = {
    orderId,
    notaryAddress,
    notarizationPercentage,
    notarizationFee,
    payDataHash,
    lock,
    sellers: notarization.result.sellers,
  };

  await axios.post(
    callbackUrl,
    notarizationResponse,
  );
  notarizationResults.store(lock, { ...notarization, status: 'responded' });
};

notarizationQueue.process(notarize);

export const addNotarizationJob = lock => notarizationQueue.add(lock);
