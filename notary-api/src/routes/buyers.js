import express from 'express';
import ethCrypto from 'eth-crypto';
// import logger from '../utils/logger';
import config from '../../config';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Wibson Notary SDK Official - Buyers API',
  });
});

router.get('/audit/consent/:dataOrder', async (req, res) => {
  const {
    privateKey,
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
  } = config;

  const message = [
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService];
  const messageHash = ethCrypto.hash.keccak256(message);
  const signature = ethCrypto.sign(privateKey, messageHash);

  if (req.params.dataOrder === 'this-is-a-real-data-order') {
    res.status(200).json({
      orderAddress,
      responsesPercentage,
      notarizationFee,
      notarizationTermsOfService,
      signature,
    });
  } else {
    res.sendStatus(400);
  }
});

export default router;
