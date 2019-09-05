import { serial as it } from 'ava';
import {
  notarizationResults,
  respondNotarizationJob,
} from './completeNotarization.mock';
import { completeNotarization } from '../../src/operations/completeNotarization';

const lock = '0x7b9a465acbec4bbce6782e7b2f00d2c6e95c49eff319f1748c1119dc9393a2f6';
const result = [
  { id: 10, identified: true },
  { id: 20, identified: 'true' },
];

it('Updates notarization and enqueues job to respond when result is present', async (assert) => {
  await completeNotarization(lock, result);
  const returnValue = await notarizationResults.update.lastCall.returnValue;
  assert.snapshot(returnValue, { id: 'notarizationResults.update().returns with result' });
  assert.true(respondNotarizationJob.called);
});

it('Updates notarization and enqueues job to respond without results', async (assert) => {
  await completeNotarization(lock);
  const returnValue = await notarizationResults.update.lastCall.returnValue;
  assert.snapshot(returnValue, { id: 'notarizationResults.update().returns without results' });
  assert.true(respondNotarizationJob.called);
});
