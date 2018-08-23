import express from 'express';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
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
  const { MSISDN } = req.params;
  const { requests } = req.app.locals.stores;

  const nonce = uuidv4();
  const state = uuidv4();
  const { mobileConnectURI, clientId, redirectURI } = config;
  // await requests.set(state, nonce, MSISDN, 'EX', 1800);

  const request = `${mobileConnectURI}?` +
    'scope=openid%20phone&' +
    'response_type=code&' +
    'acr_values=2&' +
    `client_id=${clientId}&` +
    `state=${state}&` +
    `nonce=${nonce}&` +
    `redirect_uri=${redirectURI}&` +
    `login_hint=MSISDN%3A${MSISDN}&` +
    'version=mc_di_r2_v2.3';

  try {
    const response = await axios.get(request);
    console.log('response');
    console.log(response.status);

    try {
      await requests.set(state, nonce, MSISDN, 'EX', 1800);
      res.send(response);
    } catch (error) {
      res.send(error);
    }
  } catch (error) {
    console.log('error');
    console.log(error.response.status);
    res.send(error);
  }
});


router.get('/identity-callback', async (req, res) => {
  console.log(res);
});

export default router;
