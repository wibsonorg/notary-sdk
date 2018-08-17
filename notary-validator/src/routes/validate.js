import express from 'express';
import requestPromise from 'request-promise-native';
import config from '../../config';
import { web3, cache } from '../utils';

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
router.get('/:MSISDN', async (req, res) => {
  const { MSISDN } = req.params;
  console.log(MSISDN);
  res.json({ status: 'OK' });
});

export default router;
