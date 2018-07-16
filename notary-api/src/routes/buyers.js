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

function isValidOrderAddress(buyerAddress, orderAddress) {
  // Para testear con ganache probar con:
  // orderAddress: 0x3a7c35082fe02bf39a35412ad0dc295089902aa1
  // buyerAddress: 0x393f9dddd360503fc04f543ae33c61267079dc58
  return orderAddress !== 'this-is-an-invalid-dataorder';
}

router.get('/audit/consent/:buyerAddress/:orderAddress', async (req, res) => {
  const {
    orderAddress,
    responsesPercentage,
    notarizationFee,
    notarizationTermsOfService,
  } = config;

  if (!isValidOrderAddress(req.params.buyerAddress, req.params.orderAddress)) {
    res.status(400).json({});
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

router.post(
  '/audit/result/:buyerAddress/:orderAddress',
  async (req, res) => {
    function randomInt(low, high) {
      return Math.floor((Math.random() * (high - low)) + low);
    }

    if (req.body.hasOwnProperty('dataResponses')) {
      const dataResponses = [];
      req.body.dataResponses.forEach((element) => {
        let result = 'na';

        if (randomInt(1, 100) <= config.responsesPercentage) {
          result = 'success';
        }

        dataResponses.push({
          seller: element.seller,
          result,
          signature: 'this is a signature',
        });
      });
      console.log(dataResponses);
      res.status(200).json({ dataResponses });
    } else {
      res.status(400).json({});
    }
  },
);

export default router;
