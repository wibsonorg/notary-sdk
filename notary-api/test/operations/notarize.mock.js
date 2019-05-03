import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const uuidv4 = sinon.stub().returns('3ec12ec7-b8ce-4e21-agus-e05e1ac010d9');
td.replace('uuid/v4', uuidv4);
td.replace('../../config', { batPayId: 1634170227 });

export const notarizationResults = { safeFetch: sinon.stub(), store: sinon.spy() };
td.replace('../../src/utils/stores', { notarizationResults });

export const web3 = { castToBytes: sinon.stub().returns('0x33656331326563372d623863652d346532312d616775732d653035653161633031306439') };
td.replace('../../src/utils/web3', web3);

export const notarizationsQueue = {
  add: sinon.spy(),
  process: sinon.stub(),
  on: sinon.stub(),
};

export const createQueue = sinon.stub().returns(notarizationsQueue);
td.replace('../../src/queues/createQueue', { createQueue });

export const hashing = { sha3: sinon.stub(), packMessage: sinon.stub() };
td.replace('../../src/utils/wibson-lib/cryptography/hashing', hashing);

test.beforeEach(() => {
  hashing.sha3.returns('0x8e0eaf0732773217516bd3c5fe2c8affe2bacf1ae7a4ae75a5c605d306fe4f5a');
  hashing.packMessage.returns('0xbx9fabxf9baxfb9bax6bd3c59f0aefe9e0af9e8afe78af66e7a889fea78fe8aa');
});
test.afterEach(sinon.reset);
