import express from "express";
import logger from "../logger";
import { addCacheControl } from "../response";
import { errorResponse } from "../validations";

var router = express.Router();

router.get("/buyers-api/", async function(req, res) {
  res.status(200).json({
    message: "Wibson Notary SDK Official - Buyers API"
  });
});

router.post("/buyers-api/audit-request", async function(req, res) {
  res.sendStatus(400);
});

export default router;
