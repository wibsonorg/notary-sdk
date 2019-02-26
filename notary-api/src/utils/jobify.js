import Queue from 'bull';
import config from '../../config';
import logger from './logger';

const { url, prefix } = config.redis;
const logEvent = (q, event) => ({ id = '', data: { jobName = '' } = {}, failedReason: err }) => {
  const end = err ? `\n   Reason: ${err}` : '';
  logger.info(`[${q}:${id}:${jobName}] ${event}.${end}`);
};
function createQueue(name) {
  const q = new Queue(name, url, {
    prefix: `${prefix}:${name}:jobs`,
    defaultJobOptions: {
      backoff: { type: 'linear' },
      attempts: 20,
    },
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
  });
  q.on('active', logEvent(name, 'started'));
  q.on('failed', logEvent(name, 'failed'));
  q.on('paused', logEvent(name, 'paused'));
  q.on('completed', logEvent(name, 'completed'));
  return q;
}

/**
 * Jobified queues
 * @type {Object<string,import('bull').Queue>}
 */
export const queues = {};
/**
 * Turns a function in a job
 * @param {F & Function} fn A function to be used as handler for the job
 * @param {Object} [options] Job options
 * @param {string} [options.name=fn.name] Name of the job [required] (default: [fn.name])
 * @param {string} [options.queue=name] Name of the queue (default: [name])
 * @param {number} [options.priority] Job priority in the queue (default: [undefined])
 * @param {number} [options.concurrency=1] Quantity of jobs that can run in paralel (default: [1])
 * @returns {F} A function with the same signature as [fn]
 * @template F
 */
export function jobify(fn, {
  name = fn.name,
  queue = name,
  priority,
  concurrency = 1,
} = {}) {
  const q = queues[queue] || createQueue(queue);
  if (queues[queue]) {
    q.jobHandlers[name] = fn;
  } else {
    queues[queue] = q;
    q.jobHandlers = { [name]: fn };
    q.process(concurrency, job => q
      .jobHandlers[job.data.name]
      .apply(job, job.data.args));
  }
  return (...args) => q.add({ jobName: name, args }, { priority }).finished();
}
