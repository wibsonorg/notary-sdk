import { notarizationResults, dataResponses } from '../utils/stores';
import { getAccount } from '../services/signingService';
import { getResultFromValidation } from '../services/validatorService';
import { sha3 } from '../utils/wibson-lib/cryptography/hashing';
import { AESencrypt } from '../utils/wibson-lib/cryptography/encription';
import { packPayData } from '../blockchain/batPay';
import { respondNotarizationJob } from '../jobs/respondNotarization';
import { jobify } from '../utils/jobify';

/**
 * @function completeNotarization
 *  Sets the result for each seller and enqueues a job to respond the
 *  NotarizationResult to the Buyer.
 * @param {string} lockingKeyHash
 * @param {object[]?} validatorResult
 */
export const completeNotarization = async (lockingKeyHash, validatorResult = []) => {
  const { address: notaryAddress } = await getAccount();

  await notarizationResults.update(lockingKeyHash, async ({
    masterKey,
    request: { orderId },
    result: { notarizationPercentage, notarizationFee, sellers },
  }) => {
    const filteredSellers = await Promise.all(sellers
      .map(seller => ({
        ...seller,
        result: getResultFromValidation(validatorResult.find(({ id }) => id === seller.id)),
      }))
      .filter(v => v.result !== 'rejected')
      .map(async (seller) => {
        const { decryptionKey } = await dataResponses.fetch(`${orderId}:${seller.sellerAddress}`);
        return {
          ...seller,
          decryptionKeyEncryptedWithMasterKey: AESencrypt(masterKey, decryptionKey),
        };
      }));
    return {
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
    };
  });

  respondNotarizationJob(lockingKeyHash);
};
export const completeNotarizationJob = jobify(completeNotarization);
