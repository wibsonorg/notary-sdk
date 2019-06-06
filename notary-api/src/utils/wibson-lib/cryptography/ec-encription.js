import CryptoJS from 'crypto-js';
import elliptic from 'elliptic';

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

const derive = (privateKeyA, publicKeyB) => {
  assert(Buffer.isBuffer(privateKeyA), 'Bad input');
  assert(Buffer.isBuffer(publicKeyB), 'Bad input');
  assert(privateKeyA.length === 32, 'Bad private key');
  assert(publicKeyB.length === 65, 'Bad public key');
  assert(publicKeyB[0] === 4, 'Bad public key');
  const keyA = elliptic.ec('secp256k1').keyFromPrivate(privateKeyA);
  const keyB = elliptic.ec('secp256k1').keyFromPublic(publicKeyB);
  const Px = keyA.derive(keyB.getPublic());
  return Buffer.from(Px.toArray());
};

export const decryptWithPrivateKey = (privKey, encrypted) => {
  const { cipher, ephemPublicKey } = JSON.parse(Buffer.from(encrypted, 'base64').toString());

  const privateKey = Buffer.from(privKey.replace(/^0x/, ''), 'hex');

  const px = derive(privateKey, Buffer.from(ephemPublicKey, 'hex'));
  const encryptionKey = CryptoJS.SHA512(px.toString('hex'))
    .toString()
    .slice(0, 32);

  const bytes = CryptoJS.AES.decrypt(cipher, encryptionKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  return plaintext;
};
