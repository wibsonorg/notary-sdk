import express from 'express';
// import logger from '../utils/logger';
import config from '../../config';
import { packMessage, hashMessage, signMessage }
  from '../utils/wibson-lib/cryptography';

const router = express.Router();

router.get('/', async (req, res) => {
  res.sendStatus(403);
});

router.post('/audit/consent', async (req, res) => {
  res.contentType('application/json');

  if (
    'orderAddress' in req.body
      && 'responsesPercentage' in req.body
      && 'notarizationFee' in req.body
      && 'notarizationTermsOfService' in req.body
  ) {
    const { privateKey } = config;

    let signature;

    try {
      const argsHash = packMessage(
        req.body.orderAddress,
        req.body.responsesPercentage,
        req.body.notarizationFee,
        req.body.notarizationTermsOfService,
      );

      const messageHash = hashMessage(argsHash);

      signature = signMessage(privateKey, messageHash);
    } catch (err) {
      throw new Error('Unable to create the signature');
    }

    res.status(200).json({ signature });
  } else {
    res.status(400).json({ error: 'missing parameter' });
  }
});

router.post('/audit/result', async (req, res) => {
  res.contentType('application/json');

  if (req.body.hasOwnProperty('orderAddress')
      && req.body.hasOwnProperty('sellerAddress')
      && req.body.hasOwnProperty('wasAudited')
      && req.body.hasOwnProperty('isDataValid')
  ) {
    const { privateKey } = config;

    let signature;

    try {
      const argsHash = packMessage(
        req.body.orderAddress,
        req.body.sellerAddress,
        req.body.wasAudited,
        req.body.isDataValid,
      );

      const messageHash = hashMessage(argsHash);

      signature = signMessage(privateKey, messageHash);
    } catch (err) {
      throw new Error('Unable to create the signature');
    }

    console.log(signature);

    res.status(200).json({ signature });
  } else {
    res.status(400).json({ error: 'missing parameter' });
  }
});

export default router;
