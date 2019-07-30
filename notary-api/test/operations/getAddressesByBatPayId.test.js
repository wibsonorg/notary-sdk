import { serial as it } from 'ava';
import { decryptSignedMessage, hashMessage } from './getAddressesByBatPayId.mock';
import { getAddressesByBatPayId } from '../../src/operations/getAddressesByBatPayId';

const params = {
  payIndex: 8,
  batPayId: 5,
  signature: '0x612a0e967efa6414fc1c2071ff3b9675a1554dd76cb6c17dfa892308fab97f41',
  publicKey: '12653256c4a94316da675b758537a7391b07ccbb31d85744081c769a353a50aa0a52e74e4326d3acfa5b8ffa55b5aee4b61ed99cce3c17cb5f3bd078060d9361',
};

it('Exposes an array of addresses that receive a specific payment in a specific BatPay ID', async (assert) => {
  const result = await getAddressesByBatPayId(params);
  assert.is(await decryptSignedMessage(), hashMessage());
  assert.truthy(result.length > 0);
});
