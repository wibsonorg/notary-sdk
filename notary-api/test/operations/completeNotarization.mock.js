import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

td.replace('../../config', { batPayId: 1634170227 });
td.replace('../../src/utils/jobify', { jobify: sinon.stub() });
const signingService = td.replace('../../src/services/signingService', {
  getAccount: sinon.stub(),
});

export const {
  notarizationResults,
} = td.replace('../../src/utils/stores', {
  notarizationResults: {
    fetch: sinon.stub(),
    update: sinon.spy(),
  },
});

export const {
  respondNotarizationJob,
} = td.replace('../../src/jobs/respondNotarization', {
  respondNotarizationJob: sinon.spy(),
});

test.beforeEach(() => {
  signingService.getAccount.resolves({ address: '0xcccf90140fcc2d260186637d59f541e94ff9288f' });
  notarizationResults.fetch.returns({
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
