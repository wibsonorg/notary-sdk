import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const dataResponses = { store: sinon.spy(), safeFetch: sinon.stub() };
td.replace('../../src/utils/stores', { dataResponses });

test.afterEach(sinon.resetHistory);
