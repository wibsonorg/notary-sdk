import test from 'ava';
import { axios, notarizationResults } from './notarizationsQueue.mock';
import { notarize } from '../../src/queues/notarizationsQueue';

const it = test.serial;

const lock = '0x7b9a465acbec4bbce6782e7b2f00d2c6e95c49eff319f1748c1119dc9393a2f6';

it('Calls buyer\'s callback after creating the response and stores updated notarization', async (assert) => {
  await notarize({ lock });
  assert.true(axios.post.called);
  assert.snapshot(notarizationResults.store.lastCall.args, { id: 'notarizationResults.store().args' });
});

it('Doesn\'t update store if buyer call fails', async (assert) => {
  axios.post.rejects();
  await assert.throws(notarize({ lock }));
  assert.true(axios.post.called);
  assert.false(notarizationResults.store.called);
});
