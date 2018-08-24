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


router.get('/validate/:MSISDN', async (req, res) => {
  const { MSISDN } = req.params;
  const { requests } = req.app.locals.stores;

  const nonce = uuidv4();
  const state = uuidv4();
  const { mobileConnectURI, clientId, redirectURI } = config;

  const queryString = `${mobileConnectURI}?` +
    'scope=openid%20phone&' +
    'response_type=code&' +
    'acr_values=2&' +
    `client_id=${clientId}&` +
    `state=${state}&` +
    `nonce=${nonce}&` +
    `redirect_uri=${redirectURI}&` +
    `login_hint=MSISDN%3A${MSISDN}&` +
    'version=mc_di_r2_v2.3';

  console.log(queryString);

  let response;

  try {
    response = await axios.get(queryString);
    console.log(response.status);

    try {
      const request = await requests.set(
        state,
        JSON.stringify(
          {
            state,
            nonce,
            MSISDN,
          },
          'NX', 3600,
        ),
      );
      console.log(request);

      res.status(response.status).json({ validated: true, identified: null });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error.response.status);
    res.json({ validated: false, identified: false });
  }
});

router.get('/identity-callback', async (req, res) => {
  console.log(req.query);
  const {
    error,
    error_description,
    code,
    state,
  } = req.query;

  const { requests } = req.app.locals.stores;

  console.log(error, error_description, code, state);

  if ('error' in req.query) {
    res.json({ validated: true, identified: false });
  } else {
    try {
      const value = await requests.get(state);

      console.log(value);
      res.json({ validated: true, identified: true });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
});

export default router;
