import express from 'express';
import requestPromise from 'request-promise-native';
import config from '../../config';
import { web3, cache } from '../utils';

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
router.get('/', async (_req, res) => {
  res.json({ status: 'OK' });
});

router.get('/redis', async (req, res) => {
  const { stores: { redis } } = req.app.locals;
  await redis.set('foo', 'bar');
  const bar = await redis.get('foo');

  res.json({ foo: bar });
});

router.get('/level', async (req, res) => {
  const { stores: { level } } = req.app.locals;
  await level.put('foz', 'baz');
  const baz = await level.get('foz');

  res.json({ foz: baz });
});

router.get('/cache', cache('5 minutes'), (req, res) => {
  res.json({ timestamp: Date.now() });
});

export default router;
