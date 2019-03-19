import axios from 'axios';
import config from '../../config';
import { createQueue } from './createQueue';
import { getAccount } from '../services/signingService';
import { notarizationResults } from '../utils/stores';

const queueName = 'NotarizationQueue';
const defaultJobOptions = {
  priority: 3,
  attempts: config.notarizeJobMaxAttempts,
  backoff: { type: 'linear' },
};
const notarizationQueue = createQueue(queueName, defaultJobOptions);

export const notarize = async (lock) => {
  const notarization = await notarizationResults.safeFetch(lock);
  if (!notarization) return false;

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

  const sellers = notarization.result.sellers.map(s => ({
    ...s,
    result: 'ignored',
    // TODO: fetch decryptionKey and encrypt it with masterKey
    decryptionKeyEncryptedWithMasterKey: '',
  }));

  const result = {
    orderId,
    notaryAddress,
    notarizationPercentage,
    notarizationFee,
    payDataHash, // TODO: Buyer shouldn't need this anymore
    lock,
    sellers,
  };

  await axios.post(callbackUrl, result);
  await notarizationResults.store(lock, { ...notarization, result, status: 'responded' });
  return true;
};

notarizationQueue.process('notarize', ({ data }) => notarize(data));
export const addNotarizationJob = lock => notarizationQueue.add('notarize', lock);
