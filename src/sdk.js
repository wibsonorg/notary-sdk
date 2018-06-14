import express from "express";
import logger from "./logger";
import { addCacheControl } from "./response";
import { errorResponse } from "./validations";

var router = express.Router();

// --- ( Endpoint ) ------------------------------------------------------------
router.get("/", async function(req, res) {
  let resp;
  let httpStatus = 200;

  res.status(httpStatus).send(resp);
});

export default router;
