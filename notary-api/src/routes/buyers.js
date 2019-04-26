import express from 'express';
// TODO: remove axios import (DEPRECATED)
import axios from 'axios';
import { asyncError } from '../utils';
import {
  notarizeOnDemand,
  fetchNotarizationResult,
} from '../facade/notarizeFacade';
import { getNotarizationFee } from '../facade/ordersFacade';
import signingService from '../services/signingService';
import config from '../../config';
import { notarize } from '../operations/notarize';

// TODO: remove (DEPRECATED)
const https = require('https');

// TODO: remove (DEPRECATED)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const router = express.Router();

// TODO: remove this function (DEPRECATED)
function isValidOrderAddress(buyerAddress, orderAddress) {
  // Para testear con ganache probar con:
  // orderAddress: 0x3a7c35082fe02bf39a35412ad0dc295089902aa1
  // buyerAddress: 0x393f9dddd360503fc04f543ae33c61267079dc58
  return orderAddress !== 'this-is-an-invalid-dataorder';
}

/**
 * TODO: remove this endpoint (DEPRECATED)
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
 *               type: number
 *               description: Percentage of responses to notarize
 *             notarizationFee:
 *               type: number
 *               description: Amount of WIB as fee for notarization
 *               example: 4
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

    if (!isValidOrderAddress(buyerAddress, orderAddress)) {
      res.boom.notFound();
    } else {
      try {
        const {
          responsesPercentage,
          notarizationFeePercentage,
          notarizationTermsOfService,
        } = config;

        const notarizationFee = await getNotarizationFee(orderAddress, notarizationFeePercentage);

        const { data: { signature } } = await axios.post(
          `${config.notarySigningServiceUri}/buyers/audit/consent`,
          {
            orderAddress,
            responsesPercentage,
            notarizationFee: notarizationFee.toString(),
            notarizationTermsOfService,
          },
          { httpsAgent },
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
 * TODO: remove this endpoint (DEPRECATED)
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
        const { error, result } = await fetchNotarizationResult(
          orderAddress,
          seller,
        );

        // eslint-disable-next-line no-await-in-loop
        const { signature } = await signingService.signNotarization({
          orderAddress,
          sellerAddress: seller,
          wasAudited: result === 'success' || result === 'failure',
          isDataValid: result === 'success',
        });

        dataResponses.push({
          error,
          seller,
          result,
          signature,
        });
      }

      res.status(200).json({ dataResponses });
    } else {
      res.boom.notFound();
    }
  }),
);

/**
 * TODO: remove this endpoint (DEPRECATED)
 * /buyers/audit/on-demand/{buyerAddress}/{orderAddress}:
 *   post:
 *     description: |
 *       # STEP 9A from Wibson's Protocol
 *       ## Buyer asks to notarize on demand
 */
router.post(
  '/audit/on-demand/:buyerAddress/:orderAddress',
  asyncError(async (req, res) => {
    const { orderAddress } = req.params;

    if ('dataResponses' in req.body) {
      const dataResponses = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const { seller } of req.body.dataResponses) {
        // eslint-disable-next-line no-await-in-loop
        const { error, result } = await notarizeOnDemand(
          orderAddress,
          seller,
        );

        let sig;
        if (result !== 'in-progress') {
          // eslint-disable-next-line no-await-in-loop
          const { signature } = await signingService.signNotarization({
            orderAddress,
            sellerAddress: seller,
            wasAudited: result === 'success' || result === 'failure',
            isDataValid: result === 'success',
          });
          sig = signature;
        }

        dataResponses.push({
          error,
          seller,
          result,
          signature: sig,
        });
      }

      res.status(200).json({ dataResponses });
    } else {
      res.boom.notFound();
    }
  }),
);

/**
 * @swagger
 * /notarization-request:
 *   post:
 *     description: Receives a batch of sellers to notarize
 *     parameters:
 *       - in: body
 *         name: notarizationRequest
 *         required: true
 *         schema:
 *           $ref: "#/definitions/NotarizationRequest"
 *     produces:
 *       - application/json
 *     responses:
 *       202:
 *         description: When the job was successfully added.
 *       500:
 *         description: When there was an error with the app
 *
 * definitions:
 *   NotarizationRequest:
 *     type: object
 *     required:
 *       - orderId
 *       - sellers
 *       - callbackUrl
 *     properties:
 *       orderId:
 *         type: integer
 *         description: The unique identifier for the order
 *       sellers:
 *         type: array
 *         description: List of sellers send to notarize
 *         items:
 *           $ref: "#/definitions/NotarizationRequestSeller"
 *       callbackUrl:
 *         type: string
 *         description: Buyer's URL to call after notarization
 *   NotarizationRequestSeller:
 *     type: object
 *     required:
 *       - address
 *       - id
 *       - decryptionKeyHash
 *     properties:
 *       address:
 *         type: string
 *         description: Seller's ethereum address
 *       id:
 *         type: number
 *         description: Seller ID in the DataExchange contract
 *       decryptionKeyHash:
 *         type: string
 *         description: Hash of the key that decrypts the information
 */
router.post(
  '/notarization-request',
  asyncError(async (req, res) => {
    try {
      const ok = await notarize(req.body);
      return ok ? res.sendStatus(202) : res.boom.badData('Invalid parameters');
    } catch (error) {
      return res.sendStatus(500);
    }
  }),
);

export default router;
