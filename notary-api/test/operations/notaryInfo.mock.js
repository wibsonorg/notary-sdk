import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

td.replace('../../config', {
  notaryName: 'Test Notary',
  notaryPublicBaseUrl: 'https://testdomain.org',
});

export const signingService = { signNotaryInfo: sinon.stub() };

td.replace('../../src/services/signingService', signingService);

test.afterEach(sinon.reset);
