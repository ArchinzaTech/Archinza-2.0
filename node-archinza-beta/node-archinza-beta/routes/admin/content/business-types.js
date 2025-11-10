const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { sendResponse, sendError } = require("../../../helpers/api");
const path = require("path");
const fs = require("fs");
const BusinessTypes = require("../../../models/businessTypes");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const business_types = await BusinessTypes.find();
    return res.send(sendResponse(business_types));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const business_type = await BusinessTypes.create(req.body);
    return res.send(sendResponse(business_type));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const business_type = await BusinessTypes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.send(sendResponse(business_type));
  })
);

module.exports = router;
