import { serial as it } from 'ava';
import {
  fetchTxData, transfer, notarizationResults,
  fetchTxLogs, orderId, getDataOrder, axios,
} from './payments.mock';
import { sendUnlock } from '../../src/jobs/payments';

it('sendUnlock > sends unlock if transfer is valid', async (assert) => {
  await sendUnlock(13, '0xSomeTransferHash');
  assert.true(
    fetchTxData.calledOnceWithExactly('0xSomeTransferHash'),
    'fetchTxData should be called with TransferHash',
  );
  assert.true(
    notarizationResults.safeFetch.calledOnceWithExactly(transfer.lock),
    'should fetch notarizationResults by transfer.lock',
  );
  assert.true(
    fetchTxLogs.calledOnceWithExactly(transfer.metadata),
    'fetchTxLogs should be called with transfer.metadata',
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
  await assert.throwsAsync(sendUnlock(13, '0xSomeTransferHash'));
});

it('sendUnlock > throws if payData does not match sellerIds', async (assert) => {
  fetchTxData.resolves({ ...transfer, payData: 'fakePayData' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeTransferHash'));
});

it('sendUnlock > throws if metadata does not match order', async (assert) => {
  fetchTxLogs.resolves({ orderId: 'fakeOrder' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeTransferHash'));
});

it('sendUnlock > throws if amount does not match price', async (assert) => {
  fetchTxData.resolves({ ...transfer, amount: 'fakeAmount' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeTransferHash'));
});

it('sendUnlock > throws if fee does not match requested fee', async (assert) => {
  fetchTxData.resolves({ ...transfer, fee: 'fakeFee' });
  await assert.throwsAsync(sendUnlock(13, '0xSomeTransferHash'));
});
