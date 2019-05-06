import express from 'express';
import { asyncError } from '../utils';
import { getSignedNotaryInfo } from '../operations/notaryInfo';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     description: |
 *       The main use case of this endpoint is to check if the app is
 *       responding.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 */
router.get('/', asyncError(async (req, res) => {
  const { error, ...result } = await getSignedNotaryInfo();
  if (error) {
    res.boom.badData('Operation failed', { error });
  } else {
    res.json(result);
  }
}));

export default router;
