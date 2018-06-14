import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "./logger";
import http from "http";

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
  res.on("header", function() {
    var duration = Date.now() - start;
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

const addInstrumentation = app => {
  app.disable("etag");
  app.disable("x-powered-by");

  app.use(bodyParser.json());
  app.use(requestTime);
  app.use(morgan("combined"));
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
  app.use(cors());
};

export { addInstrumentation };
