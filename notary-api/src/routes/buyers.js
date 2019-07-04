import express from 'express';
import { asyncError } from '../utils';
import { notarize } from '../operations/notarize';

const router = express.Router();

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
router.post('/notarization-request', asyncError(async (req, res) => {
  await notarize(req.body);
  res.sendStatus(202);
}));

export default router;
