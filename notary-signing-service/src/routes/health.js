import express from 'express';

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
