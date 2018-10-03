import express from 'express';
// import logger from '../utils/logger';
import config from '../../config';
import { signPayload }
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

    const signature = signPayload(
      privateKey,
      req.body.orderAddress,
      Number(req.body.responsesPercentage),
      Number(req.body.notarizationFee),
      req.body.notarizationTermsOfService,
    );

    res.status(200).json({ signature });
  } else {
    res.status(400).json({ error: 'missing parameter' });
  }
});

router.post('/audit/result', async (req, res) => {
  res.contentType('application/json');

  if ('orderAddress' in req.body
      && 'sellerAddress' in req.body
      && 'wasAudited' in req.body
      && 'isDataValid' in req.body
  ) {
    const { privateKey } = config;

    const signature = signPayload(
      privateKey,
      req.body.orderAddress,
      req.body.sellerAddress,
      req.body.wasAudited,
      req.body.isDataValid,
    );

    res.status(200).json({ signature });
  } else {
    res.status(400).json({ error: 'missing parameter' });
  }
});

export default router;
