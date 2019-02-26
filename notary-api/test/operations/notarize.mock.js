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

export const createQueue = sinon.stub().returns(notarizationsQueue);
td.replace('../../src/queues/createQueue', { createQueue });

const uuidv4 = () => '3ec12ec7-b8ce-4e21-agus-e05e1ac010d9';
td.replace('uuid/v4', uuidv4);

export const hashing = { sha3: sinon.stub() };
td.replace('../../src/utils/wibson-lib/cryptography/hashing', hashing);

test.beforeEach(() => {
  hashing.sha3.resolves('0x8e0eaf0732773217516bd3c5fe2c8affe2bacf1ae7a4ae75a5c605d306fe4f5a');
});
test.afterEach(sinon.reset);
