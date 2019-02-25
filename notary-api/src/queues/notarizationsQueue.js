import uuidv4 from 'uuid/v4';
import axios from 'axios';
import config from '../../config';
import { createQueue } from './createQueue';
import { getAccount } from '../services/signingService';
import { notarizationsKeys } from '../utils/stores';
// import { sha3 } from '../utils/wibson-lib/cryptography/hashing';

const queueName = 'NotarizationQueue';
const { fetchOrderMaxAttempts } = config;

const defaultJobOptions =
  { priority: 3, attempts: fetchOrderMaxAttempts, backoff: { type: 'linear' } };

const notarizationQueue = createQueue(queueName, defaultJobOptions);

export const notarize = async ({
  notarizationRequestId, orderId, sellers, callbackUrl,
}) => {
  const { address: notaryAddress } = await getAccount();
  const id = uuidv4();
  // sellers: [{ sellerAddress, sellerId, decryptionKeyHash, }]

  const payDataHash = '';
  const lock = 'invalid-lock';

  const notarizationResponse = {
    orderId,
    notaryAddress,
    notarizationPercentage: 0,
    notarizationFee: 0,
    payDataHash,
    lock,
    sellers,
  };

  await axios.post(
    callbackUrl,
    notarizationResponse,
  );

  notarizationsKeys.store(notarizationRequestId, id);
};

notarizationQueue.process(notarize);

export const addNotarizationJob = params => notarizationQueue.add({ ...params });
