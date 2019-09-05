import express from 'express';
import { asyncError, cache } from '../utils';
import { getSignedNotaryInfo } from '../operations/notaryInfo';

const router = express.Router();

/**
 * @swagger
 * /notary-info:
 *   get:
 *     description: |
 *       The main use case of this endpoint is get notary signed information
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app is OK
 */
router.get('/', cache('1 day'), asyncError(async (req, res) => {
  const { error, ...result } = await getSignedNotaryInfo();
  if (error) {
    res.boom.badData('Operation failed', { error });
  } else {
    res.json(result);
    req.apicacheGroup = '/notary-info';
  }
}));

export default router;
