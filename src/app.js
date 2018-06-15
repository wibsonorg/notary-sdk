import express from "express";
import logger from "./logger";
import { addInstrumentation } from "./instrumentation";
import bodyParser from "body-parser";
import api from "./api";

var app = express();
addInstrumentation(app);

app.use("/api", api);

const httpPort = 9000;
app.listen(httpPort, () =>
  logger.info(
    `App listening on port ${httpPort} :: ` +
      `NODE_ENV - ${process.env.NODE_ENV} :: ` +
      `DEPLOY_ENVIRONMENT - ${process.env.DEPLOY_ENVIRONMENT}`
  )
);

export default app;
