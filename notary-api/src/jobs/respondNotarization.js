import axios from 'axios';
import { jobify } from '../utils/jobify';
import { notarizationResults } from '../utils/stores';
import logger from '../utils/logger';

export const respondNotarization = async (lockingKeyHash) => {
  const notarization = await notarizationResults.fetch(lockingKeyHash);
  const { request: { callbackUrl }, result } = notarization;
  try {
    await axios.post(callbackUrl, result);
    await notarizationResults.update(lockingKeyHash, { status: 'responded' });
  } catch (error) {
    logger.crit('RespondNotarization Job :: Could not respond to buyer\n' +
      `Reason: ${error.message}\n` +
      `Data: ${lockingKeyHash}`);
    throw error;
  }
};
export const respondNotarizationJob = jobify(respondNotarization);
