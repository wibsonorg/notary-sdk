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
  notaryInfo,
} from './routes';
import schema from './schema';

const app = express();
swagger.initializeMiddleware(schema, ({ swaggerMetadata, swaggerValidator, swaggerUi }) => {
  app.use(boom());
  app.use(swaggerMetadata());
  app.use(helmet());
  app.use(morgan('combined', {
    stream: logger.stream,
    skip: () => config.env === 'test',
  }));
  app.use(cors());
  app.use(swaggerValidator());
  app.use(swaggerUi({ swaggerUi: '/api-docs', apiDocs: '/api-docs.json' }));
  app.use(bodyParser.json({ limit: config.bodySizeLimit }));
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
