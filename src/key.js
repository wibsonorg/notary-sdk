import express from "express";
import logger from "./logger";
import { addCacheControl } from "./response";
import { errorResponse } from "./validations";

var router = express.Router();

// Endpoint

router.get("/", async function(req, res) {
  const resp = {
    message: "Wibson Notary Key Service"
  };

  const httpStatus = 200;
  res.status(httpStatus).json(resp);
});

export default router;
