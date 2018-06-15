import app from "./app";
import logger from "./logger";

const httpPort = 9000;

app.listen(httpPort, () =>
  logger.info(
    `App listening on port ${httpPort} :: ` +
      `NODE_ENV = ${process.env.NODE_ENV} :: ` +
      `DEPLOY_ENVIRONMENT = ${process.env.DEPLOY_ENVIRONMENT}`
  )
);
