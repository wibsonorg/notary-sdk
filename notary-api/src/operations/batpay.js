import { merkle } from '../utils/wibson-lib/merkle';

const bulkRegister = (accounts) => {
  const merkleTree = merkle(accounts.sort());

  const txParams = {
    n: accounts.length,
    rootHash: merkleTree.roothash,
  };

  return {
    merkleTree,
    txParams,
  };
};

export { bulkRegister };
