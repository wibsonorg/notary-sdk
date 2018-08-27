import express from 'express';
import axios from 'axios';
import { asyncError } from '../utils';
import {
  fetchNotarizationResultOrNotarize,
  notarize,
  deleteNotarizationResult,
  storeNotarizationResult,
} from '../facade/notarizeFacade';
import signingService from '../services/signingService';
import config from '../../config';
import notarizeFacade from '../facade/notarizeFacade';
import { fromWib } from '../utils/coin';

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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 *         schema:
 *           type: object
 *           properties:
 *             orderAddress:
 *               type: string
 *               description: Ethereum address of the Order
 *             responsesPercentage:
 *               type: integer
 *               description: Percentage of responses to notarize
 *             notarizationFee:
 *               type: string
 *               description: Amount of WIB as fee for notarization
 *               example: '4'
 *             notarizationTermsOfService:
 *               type: string
 *               description: Terms for notarization service
 *             signature:
 *               type: string
 *               description: Signature of the previous params
 *       400:
 *         description: When there is a problem with the input
 *       500:
 *         description: Internal server error
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
            notarizationFee: fromWib(notarizationFee),
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

// TODO: remove before merging
router.get(
  '/notarize/:sellerAddress/:orderAddress',
  asyncError(async (req, res) => {
    const { orderAddress, sellerAddress } = req.params;
    await deleteNotarizationResult(orderAddress, sellerAddress);

    const response = await notarize(orderAddress, sellerAddress);
    res.json(response);
  }),
);

// TODO: remove before merging
router.get(
  '/notarize/:sellerAddress/:orderAddress/success',
  asyncError(async (req, res) => {
    const { orderAddress, sellerAddress } = req.params;
    await storeNotarizationResult(orderAddress, sellerAddress, { result: 'success' });

    res.json({ result: 'success' });
  }),
);

export default router;
