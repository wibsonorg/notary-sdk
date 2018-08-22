import express from 'express';
import axios from 'axios';
import config from '../../config';
import notarizeFacade from '../facade/notarizeFacade';

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

/**
 * @swagger
 * /buyers/audit/consent/{buyerAddress}/{orderAddress}:
 *   get:
 *     description: |
 *       # STEP 3 from Wibson's Protocol
 *       ## Buyer asks for notary consent to participate in a DataOrder
 */
router.get('/audit/consent/:buyerAddress/:orderAddress', async (req, res) => {
  const { orderAddress } = req.params;
  const { buyerAddress } = req.params;

  const {
    responsesPercentage,
    // If the notarization fee is 4WIB, then the configured value should be 4e+9
    notarizationFee,
    notarizationTermsOfService,
  } = config;

  if (!isValidOrderAddress(buyerAddress, orderAddress)) {
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

/**
 * @swagger
 * /buyers/audit/result/{buyerAddress}/{orderAddress}:
 *   post:
 *     description: |
 *       # STEP 9 from Wibson's Protocol
 *       ## Buyer asks for notarization results
 */
router.post(
  '/audit/result/:buyerAddress/:orderAddress',
  async (req, res) => {
    const { orderAddress } = req.params;

    if ('dataResponses' in req.body) {
      const dataResponses = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const { seller } of req.body.dataResponses) {
        // eslint-disable-next-line no-await-in-loop
        const { result, signature } = await notarizeFacade(
          orderAddress,
          seller,
        );

        dataResponses.push({
          seller,
          result,
          signature,
        });
      }

      res.status(200).json({ dataResponses });
    } else {
      res.status(400).json({});
    }
  },
);

export default router;
