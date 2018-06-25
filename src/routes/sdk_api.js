import express from "express";
import logger from "../logger";
import { addCacheControl } from "../response";
import { errorResponse } from "../validations";

var router = express.Router();

router.get("/", async function(req, res) {
  res.status(200).json({
    message: "Wibson Notary SDK Official"
  });
});

router.post("/sellers/auth", async function(req, res) {
  res.sendStatus(400);
});

export default router;
