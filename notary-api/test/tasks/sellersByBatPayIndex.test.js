import { serial as it } from 'ava';
import { sellersByPayIndex, sellersByPayIndexOldFacade } from './sellersByBatPayIndex.mock';
import sellersByBatPayIndexMigrations from '../../src/tasks/migrations/sellers-by-batPayIndex';

it('Update sellers_by_pay_index storage', async (assert) => {
  await sellersByBatPayIndexMigrations();
  assert.is(sellersByPayIndex.update.callCount, sellersByPayIndexOldFacade.length);
  assert.snapshot(sellersByPayIndex.update.lastCall.args, { id: 'update_sellers_by_pay_index ' });
});
