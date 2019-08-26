import R from 'ramda';

const reformatNotarizations = result =>
  R.pipe(
    R.groupBy(R.prop('id')), // Object<BatPayId, Array<Pair<BatPayId,Address>>>
    R.map(R.pluck('address')), // Object<BatPayId, Array<Address>>
    R.mapObjIndexed(addresses => ({ [result]: addresses })),
    // Object<BatPayId, Object<result,Array<Address>>>
  );

const mergeByBatPayId = (id, left, right) => ({ ...left, ...right });

const reformatCompleted = reformatNotarizations('completed');
const reformatRejected = reformatNotarizations('rejected');

export const getResultsByBatPayId = (completedSellers, rejectedSellers) => {
  const completed = reformatCompleted(completedSellers);
  const rejected = reformatRejected(rejectedSellers);
  return R.mergeWithKey(mergeByBatPayId, completed, rejected);
};
