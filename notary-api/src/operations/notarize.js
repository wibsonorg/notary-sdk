import { addNotarizationJob } from '../queues/notarizationsQueue';

export const notarize = params => addNotarizationJob(params);
