import { serial as it } from 'ava';
import {
  validateDataBatch,
  notarizationResults,
  completeNotarizationJob,
  config,
} from './notarizationsQueue.mock';
import { notarize } from '../../src/queues/notarizationsQueue';

const lock = '0x7b9a465acbec4bbce6782e7b2f00d2c6e95c49eff319f1748c1119dc9393a2f6';

it('Sends data to validator and updates notarization status', async (assert) => {
  await notarize(lock);
  assert.snapshot(validateDataBatch.lastCall.args, { id: 'validateDataBatch.args' });
  assert.snapshot(notarizationResults.update.lastCall.args, { id: 'notarizationResults.update().args' });
});

it('Doesn\'t update notarization status if data validator call fails', async (assert) => {
  validateDataBatch.throws();
  await assert.throwsAsync(notarize(lock));
  assert.false(notarizationResults.update.called);
});

it('Completes notarization when all sellers are ignored', async (assert) => {
  config.responsesPercentage = 0;
  await notarize(lock);
  assert.false(validateDataBatch.called);
  assert.false(notarizationResults.update.called);
  assert.true(completeNotarizationJob.called);
});
