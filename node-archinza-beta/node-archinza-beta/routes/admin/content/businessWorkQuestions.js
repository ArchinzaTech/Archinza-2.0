const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { sendResponse, sendError } = require("../../../helpers/api");
const BusinessWorkQuestions = require("../../../models/businessWorkFlowQuestion");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const question = await BusinessWorkQuestions.create(req.body);
    return res.send(sendResponse(question));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const question = await BusinessWorkQuestions.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.send(sendResponse(question));
  })
);

module.exports = router;
