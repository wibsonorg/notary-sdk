import express from "express";
import logger from "../logger";

var router = express.Router();

/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

/**
 * @swagger
 * /sdk/buyers-api:
 *   get:
 *     description: Returns smth
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: param1
 *         description: This is the param1
 *         in: queryString
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Content
 */
router.get("/buyers-api/", async function (req, res) {
  res.status(200).json({
    message: "Wibson Notary SDK Official - Buyers API"
  });
});

router.post("/buyers-api/audit-request/:dataOrder", async function (req, res) {
  console.log(req.params.dataOrder);
  res.sendStatus(400);
});

export default router;
