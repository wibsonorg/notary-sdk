import test from 'ava';
import { signingService } from './notaryInfo.mock';
import { getSignedNotaryInfo } from '../../src/operations/notaryInfo';

const it = test.serial;

it('Gets a signed offchain-package', async (assert) => {
  signingService.signNotaryInfo.returns({
    notaryName: 'Test Notary',
    notaryPublicBaseUrl: 'https://testdomain.org',
  });

  const { error, ...signedInfo } = await getSignedNotaryInfo();

  const expectedResult = {
    notaryName: 'Test Notary',
    notaryPublicBaseUrl: 'https://testdomain.org',
  };

  assert.true(signingService.signNotaryInfo.called);
  assert.deepEqual(signedInfo, expectedResult);
});

it('Gets error if package cannot get signed', async (assert) => {
  signingService.signNotaryInfo.throws();
  const { error } = await getSignedNotaryInfo();

  assert.true(signingService.signNotaryInfo.called);
  assert.not(error, undefined);
});
