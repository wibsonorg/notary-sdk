import express from 'express';
import axios from 'axios';
// import logger from '../utils/logger';
import config from '../../config';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Wibson Notary SDK Official - Buyers API',
  });
});

function isValidOrderAddress(orderAddress) {
  return orderAddress !== 'this-is-an-invalid-dataorder';
}

router.get('/audit/consent/:orderAddress', async (req, res) => {
  const {
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
  } = config;

  if (!isValidOrderAddress(req.params.orderAddress)) {
    res.sendStatus(400);
  } else {
    try {
      const { data: { signature } } = await axios.post(
        `${config.notarySigningServiceUri}/buyers/audit/consent`,
        {
          orderAddress,
          responsesPercentage,
          notarizationFee,
          notarizationTermsOfService,
        },
      );

      res.status(200).json({
        orderAddress,
        responsesPercentage,
        notarizationFee,
        notarizationTermsOfService,
        signature,
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }
});


export default router;
