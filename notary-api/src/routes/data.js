import express from 'express';
import { asyncError } from '../utils';
import { completeNotarization } from '../operations/completeNotarization';
import { notarizationResults } from '../utils/stores';

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
  const { nonce, result } = req.body;
  const notarization = await notarizationResults.safeFetch(nonce);
  if (!notarization) {
    res.boom.notFound('No notarization found');
  } else {
    await completeNotarization(nonce, result);
    res.sendStatus(202);
  }
}));

export default router;
