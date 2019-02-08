import express from 'express';
import { asyncError } from '../utils';
import { saveSeller } from '../services/sellerService';

const router = express.Router();

/**
 * @swagger
 * /sellers/heads-up:
 *   post:
 *     description: |
 *       Endpoint where the WAPI will make the POST request when the registration is finished.
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
 *       200:
 *         description: When validation results are registered successfully
 */
router.post('/heads-up', asyncError(async (req, res) => {
  const { sellerAddress, sellerId } = req.body;
  try {
    saveSeller(sellerAddress, sellerId);
    res.status(202).json({ message: 'OK' });
  } catch (error) {
    const { message } = error;
    res.boom.notFound(message);
  }
}));

export default router;
