import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const notarizationResults = { safeFetch: sinon.stub(), store: sinon.spy() };
td.replace('../../src/utils/stores', { notarizationResults });

export const notarizationsQueue = {
  add: sinon.spy(),
  process: sinon.stub(),
  on: sinon.stub(),
};

const config = { fetchOrderMaxAttempts: 1 };
td.replace('../../config', { config });

export const axios = { post: sinon.stub() };
td.replace('axios', axios);

const signingService = { getAccount: sinon.stub() };
td.replace('../../src/services/signingService', signingService);

export const createQueue = sinon.stub().returns(notarizationsQueue);
td.replace('../../src/queues/createQueue', { createQueue });

test.beforeEach(() => {
  axios.post.resolves();

  signingService.getAccount.resolves({ address: '0xcccf90140fcc2d260186637d59f541e94ff9288f' });

  notarizationResults.safeFetch.returns({
    request: {
      orderId: 42,
      callbackUrl: 'https://bapi.wibson.org/notarization-result/uuid',
    },
    result: {
      notarizationPercentage: 0,
      notarizationFee: 0,
      sellers: [
        {
          decryptionKeyHash: '0xd48b012bc6c82d8ed80f88d88adf88ab61570d44ad6116f332a42cb7f4681515',
          sellerAddress: '0xSellerA',
          sellerId: 10,
        },
        {
          decryptionKeyHash: '0x8122b2d07f65f4aaf949770358a2341410285968abb75a810a599a2563f8af38',
          sellerAddress: '0xSellerB',
          sellerId: 20,
        },
      ],
    },
    payDataHash: '',
    masterKey: '3ec12ec7-b8ce-4e21-804d-e05e1ac010d9',
    status: 'accepted',
  });
});
test.afterEach(sinon.reset);
