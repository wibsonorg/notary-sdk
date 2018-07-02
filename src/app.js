import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// My modules
import api from "./routes/api";

var app = express();

http.globalAgent.maxSockets = 100;

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function accessLog(err, req, res, next) {
  const msg = req.ip + " " + req.method + " " + req.originalUrl;
  logger.info(msg);
  next();
}

function requestTime(err, req, res, next) {
  var start = Date.now();
  res.on("header", function () {
    Date.now() - start;
  });
  next();
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Internal server error!" });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.send({ error: "Internal server error!" });
}

app.disable("etag");
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(requestTime);
app.use(morgan("combined"));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(accessLog);
app.use(cors());

// Routes

app.use("/sdk", api);

// API Documentation
// TODO: To be improved
const docsAuthentication = async (_req, _res, next) => {
  console.log("Authenticated for docs");
  next();
}
app.use('/api-docs', docsAuthentication, swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Notary SDK', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  apis: ['./src/routes/api.js'], // Path to the API docs
})));

export default app;
