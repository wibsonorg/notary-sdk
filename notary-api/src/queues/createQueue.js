import Queue from 'bull';
import { logger } from '../utils';

const PREFIX = 'notary-api:jobs';

const fullJobId = (queueName, id) => `${PREFIX}:${queueName}:${id}`;

const createQueue = (queueName, jobOpts = {}) => {
  const queue = new Queue(queueName, {
    prefix: PREFIX,
    defaultJobOptions: jobOpts,
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

  queue.enqueue = (jobType, data, options) => {
    if (options) {
      queue.add(jobType, data, options);
    } else {
      queue.add(jobType, data);
    }
  };

  return queue;
};

export { createQueue };
