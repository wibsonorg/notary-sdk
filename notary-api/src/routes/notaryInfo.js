import express from 'express';
import signingService from '../services/signingService';
import config from '../../config';

const router = express.Router();

/**
 * @swagger
 * /notary-info:
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
router.get('/', async (req, res) => {
  const { notaryName, notaryPublicBaseUrl } = config;
  const info = {
    name: notaryName,
    notarizationUrl: `${notaryPublicBaseUrl}/buyers/notarization-request`,
    dataResponsesUrl: `${notaryPublicBaseUrl}/data-responses`,
    headsUpUrl: `${notaryPublicBaseUrl}/sellers/heads-up`,
  };

  const signedInfo = await signingService.signNotaryInfo(info);

  res.json(signedInfo);
});

export default router;
