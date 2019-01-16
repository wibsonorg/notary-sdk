import attachContractEventSubscribers from './attachContractEventSubscribers';
import { notarize } from '../facade/notarizeFacade';

const notarizationRequestSubscriber = {
  name: 'NotarizationRequest',
  events: [
    'DataAdded',
  ],
  callback: async (result) => {
    const { orderAddr, seller } = result.returnValues;
    await notarize(orderAddr, seller);
  },
};
const subscribers = [notarizationRequestSubscriber];

export default (stores, startingBlock) => {
  attachContractEventSubscribers(subscribers, stores, startingBlock);
};
