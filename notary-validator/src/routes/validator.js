import express from 'express';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
import url from 'url';
import querystring from 'querystring';
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
    console.log('response');
    console.log(response.status);

    try {
      const request = await requests.set(
        state,
        JSON.stringify({
          state,
          nonce,
          MSISDN,
        }),
      );
      console.log(request);

      res.send(response);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  } catch (error) {
    console.log('error');
    console.log(error.response.status);
    res.send(error);
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

  if (error === 'access_denied') {
    res.send(error);
  } else {
    try {
      const value = await requests.get(state);
      console.log(value);
      res.send(value);
      return;
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  }
});

export default router;
