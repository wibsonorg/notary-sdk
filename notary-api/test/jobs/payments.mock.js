import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { packPayData } from '../../src/blockchain/batPay';

export const sellers = [
  { id: 7, address: '0x075a22bc34b55322cabb0aa87d9e590e01b942c4' },
  { id: 13, address: '0x075a22bc34b55322cabb0aa87d9e590e01b942c5' },
  { id: 33, address: '0x075a22bc34b55322cabb0aa87d9e590e01b942c6' },
  { id: 42, address: '0x075a22bc34b55322cabb0aa87d9e590e01b942c3' },
];
export const axios = td.replace('axios', { post: sinon.stub() });
export const { brokerUrl, batPayId } = td.replace('../../config', {
  brokerUrl: 'SomeBrokerUrl',
  batPayId: 666,
});
export const { jobify } = td.replace('../../src/utils/jobify', { jobify: sinon.stub() });
export const { fetchTxData, fetchTxLogs } = td.replace('../../src/blockchain/contracts', {
  fetchTxData: sinon.stub(),
  fetchTxLogs: sinon.stub(),
});
export const { getDataOrder } = td.replace('../../src/operations/dataExchange', {
  getDataOrder: sinon.stub(),
});
export const { notarizationResults, sellersByPayIndex } = td.replace('../../src/utils/stores', {
  notarizationResults: { safeFetch: sinon.stub() },
  sellersByPayIndex: { store: sinon.stub() },
});

export const registerPayment = {
  lockingKeyHash: 'SomeLock',
  payData: packPayData(sellers.map(({ id }) => id)),
  metadata: 'SomeCreationHash',
  amount: '250000000000',
  fee: 142,
};
export const orderId = 33;

test.beforeEach(() => {
  fetchTxData.resolves(registerPayment);
  fetchTxLogs.resolves({ orderId });
  getDataOrder.resolves({ price: 250 });
  notarizationResults.safeFetch.resolves({
    masterKey: 'SomeMasterKey',
    result: { notarizationFee: 42, notarizationPercentage: 10, sellers },
    request: { orderId: 33 },
  });
});
test.afterEach(sinon.resetHistory);
