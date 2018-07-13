import express from 'express';
import requestPromise from 'request-promise-native';
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
    signature,
  } = config;

  if (!isValidOrderAddress(req.params.orderAddress)) {
    res.sendStatus(400);
  } else {
    res.status(200).json({ orderAddress });
  }


  /* await requestPromise.get(
        'http://localhost:9001/buyers/audit/consent/this-is-a-real-data-order',
        { timeout: 1000 },
        (response) => {
          console.log('ssssssss');
          console.log(response);
        },
      );
      res.status(200).json({ status: 'OK' });
    } catch (err) {
      res.status(500).json({
        message: 'Signing Service not working as expected',
        error: err.message,
      }); */
});

export default router;
