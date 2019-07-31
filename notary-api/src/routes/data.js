import express from 'express';
import { asyncError } from '../utils';
import { completeNotarization } from '../operations/completeNotarization';
import { notarizationResults } from '../utils/stores';

const router = express.Router();

/**
 * @swagger
 * /data/validation-result:
 *   post:
 *     description: |
 *       Receives and stores data validation results so that associated
 *       DataResponse can be closed.
 *     parameters:
 *        - in: body
 *          name: validationResponse
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ValidationResponse"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When validation results are registered successfully
 *
 * definitions:
 *   ValidationResponse:
 *     type: object
 *     required:
 *       - dataGroupId
 *       - dataBatchId
 *       - result
 *     properties:
 *       dataGroupId:
 *        type: number
 *        description: The unique identifier for the validation batch.
 *       dataBatchId:
 *        type: string
 *        description: The unique identifier for the validation batch.
 *       result:
 *        type: array
 *        description: The result validation for that batch.
 *        items:
 *          type: object
 *          required:
 *            - id
 *            - validated
 *            - identified
 *          properties:
 *            id:
 *              type: string
 *              description: The unique identifier for that data.
 *            validated:
 *              type: boolean
 *              description: Whether the data was validated or not.
 *            identified:
 *              type: boolean
 *              description: Whether the validation result was positive or not.
 */
router.post('/validation-result', asyncError(async (req, res) => {
  const { dataBatchId, result } = req.body;
  const notarization = await notarizationResults.safeFetch(dataBatchId);
  if (!notarization) {
    res.boom.notFound('No notarization found');
  } else {
    await completeNotarization(dataBatchId, result);
    res.sendStatus(202);
  }
}));

export default router;
