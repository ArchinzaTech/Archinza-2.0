const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
var _ = require("lodash");
const auth = require("../middlewares/auth");
const {
  generateOTP,
  sendResponse,
  generateOTPExpiration,
  sendError,
  generateToken,
  fetchLatestrates,
  fetchUpdatedBudgetRanges,
  getBusinessTypeId,
  fetchUpdatedLargeBudgetRanges,
} = require("../helpers/api");
const agenda = require("../jobs/agenda");
const Services = require("../models/services");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const services = await Services.findOne();
    const transformedData = services.services.map((item) => {
      return {
        label: item.value,
        value: item.value,
        tag: item.tag,
      };
    });
    return res.send(sendResponse(transformedData));
  })
);

module.exports = router;
