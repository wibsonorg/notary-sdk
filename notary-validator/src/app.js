import express from 'express';
import boom from 'express-boom';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import config from '../config';
import schema from './schema';
import {
  logger,
  errorHandler,
  createBasicRedisStore,
} from './utils';

import { health, validate } from './routes';

const app = express();

app.locals.stores = {
  requests: createBasicRedisStore('requests'),
};

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(config.logType || 'combined', {
  stream: logger.stream,
  skip: () => config.env === 'test',
}));
app.use(cors());
app.use(boom());

app.use('/health', health);
app.use('/validate', validate);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (req, res) => res.json(schema));

app.use(errorHandler); // This MUST always go after any other app.use(...)

module.exports = app;
