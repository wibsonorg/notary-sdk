import express from 'express';
import ethCrypto from 'eth-crypto';
// import logger from '../utils/logger';
import config from '../../config';

const router = express.Router();

router.get('/', async (req, res) => {
  res.sendStatus(403);
});

router.post('/audit/consent/', async (req, res) => {
  res.contentType('application/json');

  if (!(req.body.hasOwnProperty('orderAddress') &&
  req.body.hasOwnProperty('responsesPercentage') &&
  req.body.hasOwnProperty('notarizationFee') &&
  req.body.hasOwnProperty('notarizationTermsOfService'))) {
    res.sendStatus(400);
  } else {
    const { privateKey } = config;

    const message = [
      req.body.orderAddress,
      req.body.responsesPercentage,
      req.body.notarizationFee,
      req.body.notarizationTermsOfService];

    const messageHash = ethCrypto.hash.keccak256(message);
    const signature = ethCrypto.sign(privateKey, messageHash);
    res.status(200).json({ signature });
  }
});

export default router;
