import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const sellers = { safeFetch: sinon.stub(), put: sinon.spy() };
td.replace('../../src/utils/stores', { sellers });

function returnSeller(address) {
  if (address === '2') return 2;
  return null;
}

test.beforeEach(() => {
  sellers.safeFetch.callsFake(returnSeller);
});
test.afterEach(sinon.reset);
