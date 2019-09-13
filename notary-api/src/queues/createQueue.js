import Queue from 'bull';
import config from '../../config';
import { logger } from '../utils';

const { url, prefix } = config.redis;
const fullJobId = (queueName, id) => `${prefix}:jobs:${queueName}:${id}`;

export function createQueue(queueName, jobOpts = {}) {
  const queue = new Queue(queueName, url, {
    prefix: `${prefix}:jobs`,
    defaultJobOptions: {
      backoff: { type: 'linear' },
      attempts: 20,
      ...jobOpts,
    },
    settings: {
      backoffStrategies: {
        linear: attemptsMade => attemptsMade * 10 * 1000,
      },
    },
  });

  queue.on('active', ({ id, name }) => {
    logger.info(`[${fullJobId(queueName, id)}][${name}] started.`);
  });

  queue.on('failed', ({
    id, name, failedReason: reason,
  }) => {
    logger.error(`[${fullJobId(queueName, id)}][${name}] failed. Reason: ${reason}`);
  });

  queue.on('completed', ({ id, name }) => {
    logger.info(`[${fullJobId(queueName, id)}][${name}] completed.`);
  });

  queue.on('paused', () => {
    logger.warning(`[${fullJobId(queueName)}] PAUSED.`);
  });

  queue.enqueue = (jobType, data, options) => {
    if (options) {
      queue.add(jobType, data, options);
    } else {
      queue.add(jobType, data);
    }
  };

  queue.getPausedCount().then((pauseCount) => {
    logger.info(`[${fullJobId(queueName)}] is on pause for ${pauseCount} jobs`);
  });

  return queue;
}
