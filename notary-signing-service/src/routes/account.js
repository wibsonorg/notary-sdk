import express from 'express';
import { account } from '../utils';
import config from '../../config';

const router = express.Router();
const { batPayId } = config;

/**
 * @swagger
 * /account:
 *   get:
 *     description: Returns account information
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When account info is available
 */
router.get('/', async (_req, res) => {
  res.json({
    address: account.getAddress(),
    publicKey: account.getPublicKey(),
    batPayId,
  });
});

export default router;
