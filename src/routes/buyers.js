import express from 'express';
import ethCrypto from 'eth-crypto';
// import logger from '../utils/logger';
// import config from '../../config';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Wibson Notary SDK Official - Buyers API',
  });
});

router.post('/audit/:dataOrder', async (req, res) => {
  res.sendStatus(400);
});

router.post('/audit/consent/:dataOrder', async (req, res) => {
  const orderAddress = '0xd56359a66d8ef7329507e5dd1f40aef7cd3320e7';
  const responsesPercentage = 30;
  const notarizationFee = 2;
  const notarizationTermsOfService = 'The terms of service';
  const notaryPrivateKey
    = '0x107be946709e41b7895eea9f2dacf998a0a9124acbb786f0fd1a826101581a07';
  const message = [
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService];
  const messageHash = ethCrypto.hash.keccak256(message);
  const signature = ethCrypto.sign(notaryPrivateKey, messageHash);

  if (req.params.dataOrder === 'this-is-a-real-data-order') {
    res.status(200).json({
      orderAddress,
      responsesPercentage,
      notarizationFee,
      notarizationTermsOfService: `${notarizationTermsOfService}`,
      signature,
    });
  } else {
    res.sendStatus(400);
  }
});

export default router;
