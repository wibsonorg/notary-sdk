import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { packPayData } from '../../src/blockchain/batPay';

export const sellers = [{ sellerId: 7 }, { sellerId: 13 }, { sellerId: 33 }, { sellerId: 42 }];
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
export const { notarizationResults } = td.replace('../../src/utils/stores', {
  notarizationResults: { safeFetch: sinon.stub() },
});

export const registerPayment = {
  lockingKeyHash: 'SomeLock',
  payData: packPayData(sellers),
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
