import { notarize } from '../../facade/notarizeFacade';

const notarizationRequestSubscriber = {
  name: 'NotarizationRequest',
  callback: async (result) => {
    console.log('[NotarizationRequest]', result);
    const { orderAddr, seller } = result.returnValues;
    await notarize(orderAddr, seller);
  },
  events: [
    'DataAdded',
  ],
};

const subscribers = [notarizationRequestSubscriber];

export default subscribers;
