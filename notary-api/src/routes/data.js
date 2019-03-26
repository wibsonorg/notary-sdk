import express from 'express';
import { asyncError } from '../utils';
import {
  updateNotarizationResultFromValidation,
  fetchAndRemoveValidationResult,
} from '../facade/notarizeFacade';

const router = express.Router();

/**
 * @swagger
 * /data/validation-result:
 *   post:
 *     description: |
 *       Receives and stores data validation results so that associated
 *       DataResponse can be closed.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When validation results are registered successfully
 */
router.post('/validation-result', asyncError(async (req, res) => {
  const dataValidationResult = await fetchAndRemoveValidationResult(req.body.nonce);
  if (!dataValidationResult) {
    res.status(404).json({ error: 'No validation result found' });
  } else {
    const { orderAddress, sellerAddress } = dataValidationResult;
    updateNotarizationResultFromValidation(orderAddress, sellerAddress, req.body);
    res.json({ status: 'OK' });
  }
}));

export default router;
