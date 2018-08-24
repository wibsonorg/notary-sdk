import express from 'express';
import axios from 'axios';
import { asyncError } from '../utils';
import {
  fetchNotarizationResultOrNotarize,
  notarize,
} from '../facade/notarizeFacade';
import signingService from '../services/signingService';
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

/**
 * @swagger
 * /buyers/audit/consent/{buyerAddress}/{orderAddress}:
 *   get:
 *     description: |
 *       # STEP 3 from Wibson's Protocol
 *       ## Buyer asks for notary consent to participate in a DataOrder
 */
router.get(
  '/audit/consent/:buyerAddress/:orderAddress',
  asyncError(async (req, res) => {
    const { orderAddress } = req.params;
    const { buyerAddress } = req.params;

    const {
      responsesPercentage,
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
            notarizationFee: notarizationFee * 1e9,
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
  }),
);

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
  asyncError(async (req, res) => {
    const { orderAddress } = req.params;

    if ('dataResponses' in req.body) {
      const dataResponses = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const { seller } of req.body.dataResponses) {
        // eslint-disable-next-line no-await-in-loop
        const { error, result } = await fetchNotarizationResultOrNotarize(
          orderAddress,
          seller,
        );

        if (result) {
          // eslint-disable-next-line no-await-in-loop
          const { signature } = await signingService.signNotarization({
            orderAddress,
            sellerAddress: seller,
            wasAudited: result === 'success',
            isDataValid: result === 'success',
          });

          dataResponses.push({
            seller,
            result,
            signature,
          });
        } else {
          dataResponses.push({
            seller,
            error,
          });
        }
      }

      res.status(200).json({ dataResponses });
    } else {
      res.status(400).json({});
    }
  }),
);

router.get(
  '/notarize/:sellerAddress/:orderAddress',
  asyncError(async (req, res) => {
    const { orderAddress, sellerAddress } = req.params;
    const response = await notarize(orderAddress, sellerAddress);
    res.json(response);
  }),
);

export default router;
