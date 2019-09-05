import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';
import { mockUpdate } from '../utils/store.mocks';

export const fakeNotarizationResult = {
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
};

td.replace('../../config', { batPayId: 1634170227 });
td.replace('../../src/utils/jobify', { jobify: sinon.stub() });
export const { getAccount } = td.replace('../../src/services/signingService', {
  getAccount: sinon.stub().resolves({ address: '0xcccf90140fcc2d260186637d59f541e94ff9288f' }),
});

export const { notarizationResults, dataResponses } = td.replace('../../src/utils/stores', {
  notarizationResults: {
    update: mockUpdate(fakeNotarizationResult),
  },
  dataResponses: {
    fetch: sinon.stub().resolves({ decryptionKey: 'SomeDecryptionKey' }),
  },
});

export const { respondNotarizationJob } = td.replace('../../src/jobs/respondNotarization', {
  respondNotarizationJob: sinon.spy(),
});

export const { AESencrypt } = td.replace('../../src/utils/wibson-lib/cryptography/encription', {
  AESencrypt: sinon.stub().returns('EncriptedKey'),
});

export const { getResultFromValidation } = td.replace('../../src/services/validatorService', {
  getResultFromValidation: sinon.stub().returns('SomeResultFromValidation'),
});

export const { sha3 } = td.replace('../../src/utils/wibson-lib/cryptography/hashing', {
  sha3: sinon.stub().returns('SomePayDataHash'),
});

export const { packPayData } = td.replace('../../src/blockchain/batPay', {
  packPayData: sinon.stub(),
});

test.afterEach(sinon.resetHistory);
