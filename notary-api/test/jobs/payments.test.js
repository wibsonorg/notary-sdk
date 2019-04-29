import { serial as it } from 'ava';
import {
  fetchTxData,
  registerPayment,
  notarizationResults,
  fetchTxLogs,
  orderId,
  getDataOrder,
  axios,
} from './payments.mock';
import { sendUnlock } from '../../src/jobs/payments';

it('sendUnlock > sends unlock if registerPayment is valid', async (assert) => {
  await sendUnlock(13, '0xSomeRegisterPaymentHash');
  assert.true(
    fetchTxData.calledOnceWithExactly('0xSomeRegisterPaymentHash'),
    'fetchTxData should be called with registerPaymentHash',
  );
  assert.true(
    notarizationResults.safeFetch.calledOnceWithExactly(registerPayment.lockingKeyHash),
    'should fetch notarizationResults by registerPayment.lockingKeyHash',
  );
  assert.true(
    fetchTxLogs.calledOnceWithExactly(registerPayment.metadata),
    'fetchTxLogs should be called with registerPayment.metadata',
  );
  assert.true(
    getDataOrder.calledOnceWithExactly(orderId),
    'getDataOrder should be called with orderId',
  );
  assert.snapshot(axios.post.lastCall.args, { id: 'axios.post().args' });
  assert.true(axios.post.calledOnce);
});

it('sendUnlock > throws if notarization not found', async (assert) => {
  notarizationResults.safeFetch.resolves(undefined);
  await assert.throwsAsync(sendUnlock(13, '0xSomeRegisterPaymentHash'));
});

it('sendUnlock > throws if payData does not match sellerIds', async (assert) => {
  fetchTxData.resolves({ ...registerPayment, payData: 'fakePayData' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeRegisterPaymentHash'));
});

it('sendUnlock > throws if metadata does not match order', async (assert) => {
  fetchTxLogs.resolves({ orderId: 'fakeOrder' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeRegisterPaymentHash'));
});

it('sendUnlock > throws if amount does not match price', async (assert) => {
  fetchTxData.resolves({ ...registerPayment, amount: 'fakeAmount' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeRegisterPaymentHash'));
});

it('sendUnlock > throws if fee does not match requested fee', async (assert) => {
  fetchTxData.resolves({ ...registerPayment, fee: 'fakeFee' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeRegisterPaymentHash'));
});
