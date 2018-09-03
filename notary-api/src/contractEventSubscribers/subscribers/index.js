import { notarize } from '../../facade/notarizeFacade';

const notarizationRequestSubscriber = {
  name: 'NotarizationRequest',
  callback: async (result) => {
    const { orderAddr, seller } = result.returnValues;
    // Addresses are being handled in lower case in other services
    await notarize(orderAddr.toLowerCase(), seller.toLowerCase());
  },
  events: [
    'DataAdded',
  ],
};

const subscribers = [notarizationRequestSubscriber];

export default subscribers;
