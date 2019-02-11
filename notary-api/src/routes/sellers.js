import express from 'express';
import { asyncError } from '../utils';
import { saveSeller } from '../services/sellerService';

const router = express.Router();

/**
 * @swagger
 * /sellers/heads-up:
 *   post:
 *     description: |
 *       Endpoint where the sellers registrerer will send the information regarding a new seller.
 *     parameters:
 *       - name: sellerAddress
 *         description: Seller's ethereum address.
 *         required: true
 *         type: string
 *         in: body
 *       - name: sellerId
 *         description: Seller's unique ID.
 *         required: true
 *         type: number
 *         in: body
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         description: When validation results are registered successfully
 */
router.post('/heads-up', asyncError(async (req, res) => {
  const { sellerAddress, sellerId } = req.body;
  if (await saveSeller(sellerAddress, sellerId)) {
    res.status(204).send();
  } else {
    res.boom.notFound('Seller has already been registered');
  }
}));

export default router;
