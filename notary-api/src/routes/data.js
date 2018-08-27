import express from 'express';
import { asyncError } from '../utils';
import {
  updateNotarizationResultFromValidation,
  fetchAndRemoveValidationResult,
} from '../facade/notarizeFacade';

const router = express.Router();

/**
 * NOTE: This endpoint should use verb `POST` for many reasons, the main one is
 *       that it updates our business enabling a DataResponse to be closed
 *       and players be payed. All these things don't happen in a common GET
 *       request.
 *
 * @swagger
 * /data/validation-result:
 *   get:
 *     description: |
 *       Receives and stores data validation results so that associated
 *       DataResponse can be closed.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When validation results are registered successfully
 */
router.get('/validation-result', asyncError(async (req, res) => {
  const dataValidationResult = await fetchAndRemoveValidationResult(req.query.nonce);
  if (!dataValidationResult) {
    res.status(404).json({ error: 'No validation result found' });
  } else {
    const { orderAddress, sellerAddress } = dataValidationResult;
    updateNotarizationResultFromValidation(orderAddress, sellerAddress, req.query);
    res.json({ status: 'OK' });
  }
}));

export default router;
