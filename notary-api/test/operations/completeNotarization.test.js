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

it('Updates notarization and enqueues job for response', async (assert) => {
  await completeNotarization(lock, result);
  assert.snapshot(notarizationResults.update.lastCall.args, { id: 'notarizationResults.update().args' });
  assert.true(respondNotarizationJob.called);
});
