import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import boom from 'express-boom';
import swagger from 'swagger-tools';
import config from '../config';
import {
  health,
  buyers,
  data,
  sellers,
  dataResponses,
  notaryInfo,
} from './routes';
import schema from './schema';
import { errorHandler } from './utils/routes';
import { stream } from './utils/logger';

const app = express();
swagger.initializeMiddleware(schema, ({ swaggerMetadata, swaggerValidator, swaggerUi }) => {
  app.use(boom()); // response helpers for errors
  app.use(helmet()); // protection against common attacks
  app.use(cors()); // control over which sites can make requests and what verbs
  // Parsers
  app.use(bodyParser.json({ limit: config.bodySizeLimit }));
  // Access log
  app.use(morgan(config.logType || 'combined', {
    stream,
    skip: () => config.env === 'test',
  }));

  app.use(swaggerMetadata());
  app.use(swaggerValidator());
  app.use(swaggerUi({ swaggerUi: '/api-docs', apiDocs: '/api-docs.json' }));
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => { throw error; });

  app.use('/health', health);
  app.use('/buyers', buyers);
  app.use('/data', data);
  app.use('/sellers', sellers);
  app.use('/data-responses', dataResponses);
  app.use('/notary-info', notaryInfo);

  app.use(errorHandler); // This MUST always go after any other app.use(...)
});

export default app;
