import app from './app';
import config from '../config';

const port = config.port;
app.listen(port, () =>
  console.log(`Wibson API listening on port ${port} in ${config.env} mode`),);
