import { notarize } from '../facade/notarizeFacade';

const notarizationRequestSubscriber = {
  name: 'NotarizationRequest',
  events: [
    'DataAdded',
  ],
  callback: async (result) => {
    const { orderAddr, seller } = result.returnValues;
    await notarize(orderAddr.toLowerCase(), seller.toLowerCase());
  },
};

export default [
  notarizationRequestSubscriber,
];
