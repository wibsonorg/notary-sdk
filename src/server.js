import app from './app';
import config from '../config';

const { port, env } = config;

app.listen(port, () =>
  console.log(`Wibson SDK listening on port ${port} in ${env} mode`));
