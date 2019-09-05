import express from 'express';
import { account } from '../utils';
import { signPayload } from '../utils/wibson-lib/cryptography';

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

/**
 * @swagger
 * /account/info:
 *   post:
 *     description: Signs specific notary info
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the notary info could be correctly signed
 */
router.post('/info', async (req, res) => {
  const address = account.getAddress().toLowerCase();
  const publicKey = account.getPublicKey().toLowerCase();
  const {
    name, notarizationUrl, dataResponsesUrl, headsUpUrl, paymentUrl,
  } = req.body;

  const privateKey = account.getPrivateKey();

  // you cannot spread an object in varargs
  const signature = signPayload(
    privateKey,
    name,
    address,
    notarizationUrl,
    dataResponsesUrl,
    headsUpUrl,
    paymentUrl,
    publicKey,
  );

  res.json({
    name,
    address,
    notarizationUrl,
    dataResponsesUrl,
    headsUpUrl,
    publicKey,
    paymentUrl,
    signature,
  });
});

export default router;
