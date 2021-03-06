import { serial as it } from 'ava';
import {
  notarizationResults,
  addNotarizationJob,
  uuidv4,
} from './notarize.mock';
import { notarize } from '../../src/operations/notarize';

const params = {
  orderId: 123,
  sellers: [
    {
      decryptionKeyHash: '0xd48b012bc6c82d8ed80f88d88adf88ab61570d44ad6116f332a42cb7f4681515',
      sellerAddress: '0xSellerA',
      sellerId: 10,
    },
    {
      decryptionKeyHash: '0x8122b2d07f65f4aaf949770358a2341410285968abb75a810a599a2563f8af38',
      sellerAddress: '0xSellerB',
      sellerId: 20,
    },
  ],
  callbackUrl: 'https://bapi.wibson.org/notarization-result/uuid',
};

it('Stores notarization object and enqueues job if proper parameters', async (assert) => {
  await notarize(params);
  assert.snapshot(notarizationResults.store.lastCall.args, { id: 'notarizationResults.store().args' });
  assert.true(addNotarizationJob.called);
});

it('Doesn\'t store notarization object nor enqueues jobs if wrong parameters', async (assert) => {
  uuidv4.throws(); // Simulates an error with master key / payData
  await assert.throwsAsync(notarize(params));
  assert.false(notarizationResults.store.called);
  assert.false(addNotarizationJob.called);
});
