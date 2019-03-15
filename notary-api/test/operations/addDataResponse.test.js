import { serial as it } from 'ava';
import { dataResponses } from './addDataResponse.mock';
import { addDataResponse } from '../../src/operations/addDataResponse';

const someDataResponse = {
  orderId: 42,
  sellerAddress: '0xa42df59C5e17df255CaDfF9F52a004221f774f36',
  sellerId: 1085,
  encryptedData: 'tZ4MsEnfbcDOwqau68aOrQ==',
  decryptionKey: '8f54f1c2d0eb5771cd5bf67a6689fcd6eed9444d91a39e5ef32a9b4ae5ca14ff',
};

it('returns id and status', async (assert) => {
  const { id, status } = await addDataResponse(someDataResponse);
  assert.is(id, '42:0xa42df59C5e17df255CaDfF9F52a004221f774f36');
  assert.is(status, 'accepted');
});

it('returns the stored DataResponse if already accepted', async (assert) => {
  dataResponses.safeFetch.withArgs('42:0xa42df59C5e17df255CaDfF9F52a004221f774f36').returns(someDataResponse);
  const response = await addDataResponse(someDataResponse);
  assert.deepEqual(response, someDataResponse);
  assert.false(dataResponses.store.called);
});
