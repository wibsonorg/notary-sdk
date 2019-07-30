import { sellersByPayIndex } from '../utils/stores';
import { BatPay } from '../blockchain/contracts';
import { decryptSignedMessage, hashMessage } from '../utils/wibson-lib/cryptography';

export const getAddressesByBatPayId = async ({
  payIndex, batPayId, signature, publicKey,
}) => {
  let addresses = [];
  const [batPayAddress] = Object.values(await BatPay.methods.accounts(batPayId).call());
  const message = hashMessage(batPayAddress + payIndex);
  const decryptMessage = await decryptSignedMessage(batPayAddress, publicKey, signature);
  if (decryptMessage === message) {
    addresses = await sellersByPayIndex.safeFetch(payIndex);
  }
  return addresses;
};
