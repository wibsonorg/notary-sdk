import { packMessage, hashMessage, signMessage } from '../cryptography';

const signSomething = (privateKey, ...args) => {
  try {
    // 1. We calculate the sha3 of given input parameters in the same
    // way solidity would. This means arguments will be ABI converted and
    // tightly packed before being hashed.
    const argsHash = packMessage(...args);

    // 2. We hash the tightly packed message the solidity way. The data will be
    // UTF-8 HEX decoded and enveloped as follows:
    // "\x19Ethereum Signed Message:\n" + message.length + message
    // and hashed using keccak256.
    const messageHash = hashMessage(argsHash);

    // 3. We sign the keccak256, solidity-compatible message
    // using secp256k1 algorithm.
    return signMessage(privateKey, messageHash);
  } catch (err) {
    throw new Error('Unable to create the signature');
  }
};

export default signSomething;
