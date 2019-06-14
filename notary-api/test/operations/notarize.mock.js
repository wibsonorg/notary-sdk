import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const uuidv4 = sinon.stub();
td.replace('uuid/v4', uuidv4);
td.replace('../../config', { batPayId: 1634170227 });

export const addNotarizationJob = sinon.stub();
td.replace('../../src/queues/notarizationsQueue', { addNotarizationJob });

export const hashLock = sinon.stub();
td.replace('../../src/blockchain/batPay', { hashLock });

export const notarizationResults = { safeFetch: sinon.stub(), store: sinon.spy() };
td.replace('../../src/utils/stores', { notarizationResults });

export const web3 = { castToBytes: sinon.stub().returns('0x33656331326563372d623863652d346532312d616775732d653035653161633031306439') };
td.replace('../../src/utils/web3', web3);

test.beforeEach(() => {
  uuidv4.returns('3ec12ec7-b8ce-4e21-agus-e05e1ac010d9');
  hashLock.returns('locking-key-hash');
});
test.afterEach(sinon.reset);
