import express from 'express';
import { asyncError } from '../utils';
import { saveSeller } from '../operations/saveSeller';
import { getAddressesByBatPayId } from '../operations/getAddressesByBatPayId';

const router = express.Router();

/**
 * @swagger
 * /sellers/heads-up:
 *   post:
 *     description: |
 *       Endpoint where the sellers registrerer will send the information regarding a new seller.
 *     parameters:
 *       - in: body
 *         name: seller
 *         required: true
 *         schema:
 *           required:
 *             - sellerId
 *             - sellerAddress
 *           properties:
 *             sellerId:
 *               type: number
 *               description: Seller's unique ID
 *             sellerAddress:
 *               type: string
 *               description: Seller's ethereum address
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: When validation results are registered successfully
 *       422:
 *         description: When seller has already been registered
 */
router.post('/heads-up', asyncError(async (req, res) => {
  const { sellerAddress, sellerId } = req.body;
  if (await saveSeller(sellerAddress, sellerId)) {
    res.status(204).send();
  } else {
    res.boom.badData('Seller has already been registered');
  }
}));

/**
 * @swagger
 * /sellers/payment:
 *   get:
 *     description: |
 *       Exposes the addresses that receive a specific payment in a specific BatPay ID
 *     parameters:
 *       - in: query
 *         name: payIndex
 *         type: number
 *         description: Payment index in BatPay
 *         required: true
 *       - in: query
 *         name: batPayId
 *         type: number
 *         description: The register id in BatPay.
 *         required: true
 *       - in: query
 *         name: signature
 *         type: string
 *         description: The signed of the owner of the BatPay ID.
 *         required: true
 *       - in: query
 *         name: publicKey
 *         type: string
 *         description: The public key of the owner of the BatPay ID.
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 *       422:
 *         description: Problem on our side
 *       500:
 *         description: Problem on our side
 */
router.get('/payment', asyncError(async (req, res) => {
  const { addresses, error } = await getAddressesByBatPayId(req.query);
  if (!error) {
    res.json(addresses);
  } else {
    res.boom.badData(error.message);
  }
}));

export default router;
