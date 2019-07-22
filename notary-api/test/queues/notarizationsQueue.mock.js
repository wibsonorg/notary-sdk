import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const config = td.replace('../../config', {
  fetchOrderMaxAttempts: 1,
  responsesPercentage: 100,
});

export const {
  notarizationResults,
  dataResponses,
} = td.replace('../../src/utils/stores', {
  notarizationResults: {
    safeFetch: sinon.stub(),
    update: sinon.spy(),
  },
  dataResponses: {
    fetch: sinon.stub(),
  },
});
const {
  decryptWithPrivateKey,
} = td.replace('../../src/utils/wibson-lib/cryptography', {
  decryptWithPrivateKey: sinon.stub(),
});

export const {
  validateDataBatch,
} = td.replace('../../src/services/validatorService', {
  validateDataBatch: sinon.stub(),
});

const notarizationsQueue = {
  add: sinon.spy(),
  process: sinon.stub(),
  on: sinon.stub(),
};
td.replace('../../src/queues/createQueue', {
  createQueue: sinon.stub().returns(notarizationsQueue),
});

export const { completeNotarizationJob } = td.replace('../../src/operations/completeNotarization', {
  completeNotarizationJob: sinon.spy(),
});

export const { getDataOrder } = td.replace('../../src/operations/dataExchange', {
  getDataOrder: sinon.spy(dxid => ({ id: `some-uuid-for-order-${dxid}` })),
});

test.beforeEach(() => {
  decryptWithPrivateKey.returns(JSON.stringify({
    geolocalization: 'Geo Localization Data',
    device: 'Device Data',
  }));

  dataResponses.fetch.returns({ encryptedData: 'Encrypted Data', decryptionKey: 'Decryption Key' });
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
          address: '0xSellerA',
          id: 10,
        },
        {
          decryptionKeyHash: '0x8122b2d07f65f4aaf949770358a2341410285968abb75a810a599a2563f8af38',
          address: '0xSellerB',
          id: 20,
        },
      ],
    },
    payDataHash: '',
    masterKey: '3ec12ec7-b8ce-4e21-804d-e05e1ac010d9',
    status: 'accepted',
  });
});
test.afterEach(sinon.reset);
