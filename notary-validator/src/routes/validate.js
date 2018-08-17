import express from 'express';
import axios from 'axios';
import config from '../../config';

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
  try {
    const { MSISDN } = req.params;
    await axios.get(' https://mobileconnect.telefonica.es/es/oauth2/authorize?scope=openid%20phone&response_type=code&client_id=ce9c1d81-9191-4082-a954-bbfdc7e0cd93&acr_values=2&state=eee40fe4-8a8d-4b26-8dfd-2fb4d52aa361&redirect_uri=https%3A%2F%2Fwibson-notary.elevenpaths.com%2Fdatavalidator%2Fidentity-callback&nonce=878aacd7-83f1-4b4f-9582-7347b0a6fa61&login_hint=MSISDN%3A34689435912');
  } catch (error) {
    res.json(error);
  }
});

export default router;
