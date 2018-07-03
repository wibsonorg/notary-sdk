import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import boom from 'express-boom';
import { health } from './routes';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());
app.use(boom());

app.use('/health', health);

export default app;
