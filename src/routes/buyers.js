import express from 'express';
// import logger from '../utils/logger';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Wibson Notary SDK Official - Buyers API',
  });
});

router.post('/audit/:dataOrder', async (req, res) => {
  res.sendStatus(400);
});

export default router;
