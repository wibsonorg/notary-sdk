import express from 'express';
import { asyncError } from '../utils';
import { saveSeller } from '../operations/saveSeller';

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

export default router;
