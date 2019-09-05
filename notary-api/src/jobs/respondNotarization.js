import axios from 'axios';
import { jobify } from '../utils/jobify';
import { notarizationResults } from '../utils/stores';

export const respondNotarization = async (lockingKeyHash) => {
  const notarization = await notarizationResults.fetch(lockingKeyHash);
  const { request: { callbackUrl }, result } = notarization;
  await axios.post(callbackUrl, result);
  await notarizationResults.update(lockingKeyHash, { status: 'responded' });
};
export const respondNotarizationJob = jobify(respondNotarization);
