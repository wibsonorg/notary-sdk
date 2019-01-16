import express from 'express';
import signingService from '../services/signingService';

const NS_PER_SEC = 1e9;

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
router.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

/**
 * @swagger
 * /health/deep:
 *   get:
 *     description: Check if the app and sub-systems are working.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the app and sub-systems are OK
 *       500:
 *         description: When the app or sub-systems are not responding
 */
router.get('/ss', async (req, res) => {
  const time = process.hrtime();
  const response = await signingService.getHealth();
  const diff = process.hrtime(time);

  res.json({
    ...response,
    ns: `Took ${(diff[0] * NS_PER_SEC) + diff[1]} nanoseconds`,
  });
});

router.get('/client_error', (req, res) => {
  res.boom.badRequest('this should fail');
});

router.get('/server_error', () => {
  throw new Error('this should fail');
});

function resolveAfter10ms(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 10);
  });
}

router.get('/async_ok', async (req, res) => {
  const x = await resolveAfter10ms(42);
  res.json({ result: x });
});

router.get('/async_error', async (req, res) => {
  try {
    await resolveAfter10ms(42);
    throw new Error('This should fail');
  } catch (err) {
    res.status(500).end();
  }
});

export default router;
