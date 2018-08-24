import { logger } from '../../utils';

const notarizationRequestSubscriber = {
  name: 'NotarizationRequest',
  callback: async (res) => {
    logger.info(`[NotarizationRequest] received ${JSON.stringify({ event: res.event })}`);
  },
  events: [
    'DataAdded',
  ],
};

const subscribers = [notarizationRequestSubscriber];

export default subscribers;
