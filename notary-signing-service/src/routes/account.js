import express from 'express';
import { account } from '../utils';

const router = express.Router();

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
  });
});

export default router;
