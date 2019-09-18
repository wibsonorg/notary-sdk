import { serial as it } from 'ava';
import { getResultsByBatPayId } from '../../src/jobs/paymentsHelpers';
import { paidSellers, rejectedSellers } from './paymentsHelpers.cases';

it('getResultsByBatPayId > empty batch returns empty object', (assert) => {
  const result = getResultsByBatPayId([], []);
  assert.snapshot(
    result,
    { id: 'getResultsByBatPayId.emptyBatch' },
    'empty batch should return empty object',
  );
});

it('getResultsByBatPayId > empty rejected returns full object', (assert) => {
  const result = getResultsByBatPayId(paidSellers, []);
  assert.snapshot(
    result,
    { id: 'getResultsByBatPayId.emptyRejected' },
    'empty rejected sellers should return full object',
  );
});

it('getResultsByBatPayId > empty completed returns full object', (assert) => {
  const result = getResultsByBatPayId([], rejectedSellers);
  assert.snapshot(
    result,
    { id: 'getResultsByBatPayId.emptyCompleted' },
    'empty completed sellers should return full object',
  );
});

it('getResultsByBatPayId > full batch returns full object', (assert) => {
  const result = getResultsByBatPayId(paidSellers, rejectedSellers);
  assert.snapshot(
    result,
    { id: 'getResultsByBatPayId.fullBatch' },
    'empty completed sellers should return full object',
  );
});
