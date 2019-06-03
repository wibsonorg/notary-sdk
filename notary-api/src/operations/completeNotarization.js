import { notarizationResults } from '../utils/stores';
import { getAccount } from '../services/signingService';
import { resultFromValidation } from '../services/validatorService';
import { sha3 } from '../utils/wibson-lib/cryptography/hashing';
import { packPayData } from '../blockchain/batPay';
import { respondNotarizationJob } from '../jobs/respondNotarization';
import { jobify } from '../utils/jobify';

const buildResult = (seller, validatorResult) => {
  const { address } = seller;
  const validation = validatorResult[address];

  return {
    ...seller,
    result: validation ? resultFromValidation(validation) : 'ignored',
    // TODO: fetch decryptionKey and encrypt it with masterKey
    decryptionKeyEncryptedWithMasterKey: '',
  };
};

/**
 * @function completeNotarization
 * @param {string} lockingKeyHash
 * @param {object?} validatorResult
 */
export const completeNotarization = async (lockingKeyHash, validatorResult = {}) => {
  const notarization = await notarizationResults.fetch(lockingKeyHash);
  const {
    request: { orderId },
    result: { notarizationPercentage, notarizationFee, sellers },
  } = notarization;

  const filteredSellers = sellers
    .map(seller => buildResult(seller, validatorResult))
    .filter(({ result }) => result !== 'rejected');

  const { address: notaryAddress } = await getAccount();
  await notarizationResults.update(lockingKeyHash, {
    status: 'validated',
    result: {
      sellers: filteredSellers,
      orderId,
      notaryAddress,
      notarizationPercentage,
      notarizationFee,
      // TODO: is `payDataHash` still necessary?
      payDataHash: sha3(packPayData(filteredSellers.map(({ id }) => id))),
      lockingKeyHash,
    },
  });
  respondNotarizationJob(lockingKeyHash);
};
export const completeNotarizationJob = jobify(completeNotarization);
