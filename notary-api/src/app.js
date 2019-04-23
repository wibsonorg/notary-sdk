import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import boom from 'express-boom';
import swagger from 'swagger-tools';
import config from '../config';
import { logger, errorHandler } from './utils';
import {
  health,
  buyers,
  data,
  sellers,
  dataResponses,
} from './routes';
import schema from './schema';

const app = express();
swagger.initializeMiddleware(schema, ({ swaggerMetadata, swaggerValidator, swaggerUi }) => {
  app.use(swaggerMetadata());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(morgan('combined', {
    stream: logger.stream,
    skip: () => config.env === 'test',
  }));
  app.use(cors());
  app.use(boom());
  app.use(swaggerValidator());
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => { throw error; });

  app.use('/health', health);
  app.use('/buyers', buyers);
  app.use('/data', data);
  app.use('/sellers', sellers);
  app.use('/data-responses', dataResponses);
  app.get('/api-docs', swaggerUi());
  app.get('/api-docs.json', (_req, res) => res.json(schema));

  app.use(errorHandler); // This MUST always go after any other app.use(...)
});

export default app;
