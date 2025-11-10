const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/personalAccount");
const Option = require("../../models/options");
var _ = require("lodash");
const Fuse = require("fuse.js");

const config = require("../../config/config");

const {
  sendResponse,
  sendError,
  validator,
  generateToken,
  generateOTP,
  isProduction,
} = require("../../helpers/api");
const proAccessEntries = require("../../models/proAccessEntries");
const country = require("../../models/country");
const city = require("../../models/city");

router.get(
  "/countries",
  asyncHandler(async (req, res) => {
    const data = await country.find().select("-_id id name");

    res.send(sendResponse(data));
  })
);
router.get(
  "/cities/:country_id",
  asyncHandler(async (req, res) => {
    const rules = Joi.object({
      country_id: Joi.number().required(),
    }).options({});

    const { error } = validator(
      {
        country_id: req.params.country_id,
      },
      rules
    );
    if (error) {
      res.send(sendError(error.details[0].message, 400));
      return;
    }

    const data = await city
      .find({ country_id: req.params.country_id })
      .sort({ name: 1 })
      .select("-_id id name country_id country_name");

    res.send(sendResponse(data));
  })
);

module.exports = router;
