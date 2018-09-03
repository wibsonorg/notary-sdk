import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import boom from 'express-boom';
import swaggerUi from 'swagger-ui-express';
import config from '../config';
import { logger, errorHandler } from './utils';
import { health, buyers, data } from './routes';
import schema from './schema';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined', {
  stream: logger.stream,
  skip: () => config.env === 'test',
}));
app.use(cors());
app.use(boom());

app.use('/health', health);
app.use('/buyers', buyers);
app.use('/data', data);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(schema));
app.get('/api-docs.json', (_req, res) => res.json(schema));

app.use(errorHandler); // This MUST always go after any other app.use(...)

export default app;
