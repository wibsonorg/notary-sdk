import express from 'express';
import { asyncError } from '../utils';
import { addDataResponse } from '../operations/addDataResponse';

const router = express.Router();

/**
 * @swagger
 * /data-responses:
 *   post:
 *     description: |
 *       # STEP 4 from Wibson's Protocol
 *       ## Notary accumulates DataResponses to notarize them by batches.
 *     parameters:
 *       - in: body
 *         name: dataResponse
 *         type: object
 *         required: true
 *         schema:
 *           $ref: "#/definitions/DataResponse"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the DataResponse was accepted
 *       422:
 *         description: When the DataResponse has missing or invalid fields
 *       500:
 *         description: When there is a problem processing the DataResponse
 *
 * definitions:
 *   DataResponse:
 *     type: object
 *     properties:
 *       orderId:
 *         type: number
 *         required: true
 *         description: Order ID in the DataExchange contract
 *         example: '42'
 *       sellerAddress:
 *         type: string
 *         required: true
 *         description: Seller's Ethereum address
 *         example: '"0xa42df59C5e17df255CaDfF9F52a004221f774f36"'
 *       sellerId:
 *         type: number
 *         description: Seller's ID in the BatPay contract
 *         example: '1085'
 *       encryptedData:
 *         type: string
 *         required: true
 *         description: Data encrypted with symmetric-key algorithm
 *         example: '"tZ4MsEnfbcDOwqau68aOrQ=="'
 *       decryptionKey:
 *         type: string
 *         required: true
 *         description: Key used to encrypt the data
 *         example: '"07855b46a623a8ecabac76ed697aa4e13631e3b6718c8a0d342860c13c30d2fc"'
 */
router.post('/', asyncError(async (req, res) => {
  const { error, ...result } = await addDataResponse(req.body.dataResponse);

  if (error) {
    res.boom.badData('Operation failed', { error });
  } else {
    res.json(result);
  }
}));

export default router;
