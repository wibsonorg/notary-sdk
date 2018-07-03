import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import boom from 'express-boom';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { health } from './routes';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());
app.use(boom());

app.use('/health', health);

const ls = dir =>
  fs.readdirSync(dir)
    .reduce((accumulator, file) => [...accumulator, `${dir}/${file}`], []);

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Notary SDK',
      version: '1.0.0',
    },
  },
  apis: ls('src/routes'),
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

export default app;
