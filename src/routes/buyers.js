import express from 'express';
import logger from '../utils/logger';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Wibson Notary SDK Official - Buyers API',
  });
});

export default router;

/*
router.post('/buyers-api/audit-request/:dataOrder', async (req, res) => {
  logger.log(req.params.dataOrder);
  res.sendStatus(400);
});
*/
